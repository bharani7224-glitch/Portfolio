import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ENV } from '../config/env.js';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export class AppError extends Error {
  public status: number;
  public type: string;
  public details?: Record<string, string[]>;

  constructor(status: number, message: string, type = 'about:blank', details?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.type = type;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    err.errors.forEach((issue) => {
      const field = issue.path.join('.') || 'body';
      if (!formattedErrors[field]) formattedErrors[field] = [];
      formattedErrors[field].push(issue.message);
    });

    res.status(400).json({
      type: 'https://api.portfolio.dev/errors/validation-error',
      title: 'Bad Request',
      status: 400,
      detail: 'The submitted request data failed schema validation.',
      instance: req.originalUrl,
      errors: formattedErrors,
    });
    return;
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    res.status(err.status).json({
      type: err.type,
      title: err.message,
      status: err.status,
      detail: err.message,
      instance: req.originalUrl,
      ...(err.details ? { errors: err.details } : {}),
    });
    return;
  }

  // 3. Mongoose CastError (Invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      type: 'https://api.portfolio.dev/errors/invalid-identifier',
      title: 'Invalid ID Format',
      status: 400,
      detail: `The provided identifier '${err.value}' is not a valid format.`,
      instance: req.originalUrl,
    });
    return;
  }

  // 4. Mongoose Duplicate Key Error (Code 11000)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const val = err.keyValue ? err.keyValue[field] : '';
    res.status(409).json({
      type: 'https://api.portfolio.dev/errors/duplicate-resource',
      title: 'Conflict',
      status: 409,
      detail: `A project with the ${field} '${val}' already exists. Please choose a different ${field}.`,
      instance: req.originalUrl,
      errors: {
        [field]: [`${field} '${val}' is already taken`],
      },
    });
    return;
  }

  // 5. Unhandled / Internal Server Error
  console.error(`[Unhandled Error] ${req.method} ${req.originalUrl}:`, err);

  const status = err.status && typeof err.status === 'number' ? err.status : 500;
  const detail = ENV.IS_PRODUCTION
    ? 'An unexpected internal server error occurred.'
    : err.message || 'Internal Server Error';

  res.status(status).json({
    type: 'https://api.portfolio.dev/errors/internal-error',
    title: 'Internal Server Error',
    status,
    detail,
    instance: req.originalUrl,
  });
}
