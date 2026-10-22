import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

export async function listAdminProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status = 'all', category, search, page = 1, pageSize = 20 } = req.query as any;

    const query: Record<string, any> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search && typeof search === 'string' && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { slug: { $regex: sanitized, $options: 'i' } },
        { shortDescription: { $regex: sanitized, $options: 'i' } },
        { technologies: { $in: [new RegExp(sanitized, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const [projects, total, publishedCount, draftCount] = await Promise.all([
      Project.find(query)
        .sort({ displayOrder: 1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
      Project.countDocuments({ status: 'published' }),
      Project.countDocuments({ status: 'draft' }),
    ]);

    const formattedProjects = projects.map((p: any) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      technologies: p.technologies,
      thumbnailUrl: p.thumbnailUrl,
      githubUrl: p.githubUrl,
      liveDemoUrl: p.liveDemoUrl,
      category: p.category,
      featured: p.featured,
      displayOrder: p.displayOrder,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    res.setHeader('Cache-Control', 'no-store, private');

    res.status(200).json({
      success: true,
      data: formattedProjects,
      counts: {
        totalAll: publishedCount + draftCount,
        published: publishedCount,
        draft: draftCount,
      },
      pagination: {
        total,
        page: Number(page),
        pageSize: limit,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid project ID format.', 'https://api.portfolio.dev/errors/invalid-id');
    }

    const project = await Project.findById(id).lean();

    if (!project) {
      throw new AppError(404, 'Project not found.', 'https://api.portfolio.dev/errors/not-found');
    }

    res.setHeader('Cache-Control', 'no-store, private');

    res.status(200).json({
      success: true,
      data: {
        id: (project as any)._id.toString(),
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        description: project.description,
        technologies: project.technologies,
        thumbnailUrl: project.thumbnailUrl,
        githubUrl: project.githubUrl,
        liveDemoUrl: project.liveDemoUrl,
        category: project.category,
        featured: project.featured,
        displayOrder: project.displayOrder,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body;

    // Check slug uniqueness
    const existing = await Project.findOne({ slug: data.slug.toLowerCase() });
    if (existing) {
      throw new AppError(
        409,
        `A project with the slug '${data.slug}' already exists. Please choose a unique slug.`,
        'https://api.portfolio.dev/errors/duplicate-slug',
        { slug: [`The slug '${data.slug}' is already taken.`] }
      );
    }

    const newProject = new Project({
      ...data,
      slug: data.slug.toLowerCase(),
    });

    const saved = await newProject.save();

    res.setHeader('Cache-Control', 'no-store, private');

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: saved.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid project ID format.', 'https://api.portfolio.dev/errors/invalid-id');
    }

    const data = req.body;

    // Check if updating slug to an existing slug owned by another project
    if (data.slug) {
      const existing = await Project.findOne({
        slug: data.slug.toLowerCase(),
        _id: { $ne: id },
      });

      if (existing) {
        throw new AppError(
          409,
          `A project with the slug '${data.slug}' already exists. Please choose a unique slug.`,
          'https://api.portfolio.dev/errors/duplicate-slug',
          { slug: [`The slug '${data.slug}' is already taken.`] }
        );
      }
      data.slug = data.slug.toLowerCase();
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError(404, 'Project not found.', 'https://api.portfolio.dev/errors/not-found');
    }

    res.setHeader('Cache-Control', 'no-store, private');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updated.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid project ID format.', 'https://api.portfolio.dev/errors/invalid-id');
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updated) {
      throw new AppError(404, 'Project not found.', 'https://api.portfolio.dev/errors/not-found');
    }

    res.setHeader('Cache-Control', 'no-store, private');

    res.status(200).json({
      success: true,
      message: `Project ${status === 'published' ? 'published' : 'unpublished'} successfully.`,
      data: updated.toJSON(),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid project ID format.', 'https://api.portfolio.dev/errors/invalid-id');
    }

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError(404, 'Project not found.', 'https://api.portfolio.dev/errors/not-found');
    }

    res.setHeader('Cache-Control', 'no-store, private');

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
}
