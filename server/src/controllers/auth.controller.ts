import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generic login failure to avoid user enumeration
    if (!user) {
      throw new AppError(
        401,
        'Invalid email or password.',
        'https://api.portfolio.dev/errors/invalid-credentials'
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError(
        401,
        'Invalid email or password.',
        'https://api.portfolio.dev/errors/invalid-credentials'
      );
    }

    const token = jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
        tokenVersion: user.tokenVersion ?? 0,
      },
      ENV.JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: ENV.JWT_ISSUER,
        audience: ENV.JWT_AUDIENCE,
      }
    );

    // Set secure HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: ENV.IS_PRODUCTION,
      sameSite: ENV.IS_PRODUCTION ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      message: 'Logged in successfully.',
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  // Server-side revocation: if request has a valid token, increment user tokenVersion
  try {
    let token = req.cookies?.auth_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7).trim();
    }
    if (token) {
      const decoded = jwt.decode(token) as { sub?: string } | null;
      if (decoded?.sub) {
        await User.findByIdAndUpdate(decoded.sub, { $inc: { tokenVersion: 1 } });
      }
    }
  } catch {
    // Invalidation error should not block cookie clearing
  }

  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: ENV.IS_PRODUCTION,
    sameSite: ENV.IS_PRODUCTION ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}
