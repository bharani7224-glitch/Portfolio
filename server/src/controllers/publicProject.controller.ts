import { Request, Response, NextFunction } from 'express';
import { Project } from '../models/Project.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

export async function listPublicProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, tag, featured, search, page = 1, pageSize = 12 } = req.query as any;

    const query: Record<string, any> = {
      status: 'published',
    };

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (tag) {
      query.technologies = { $in: [tag] };
    }

    if (typeof featured === 'boolean') {
      query.featured = featured;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { shortDescription: { $regex: sanitized, $options: 'i' } },
        { technologies: { $in: [new RegExp(sanitized, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Project.countDocuments(query),
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

    // HTTP Cache-Control for high-performance public responses
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');

    res.status(200).json({
      success: true,
      data: formattedProjects,
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

export async function getPublicProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = String(req.params.slug);

    const project = await Project.findOne({
      slug: slug.toLowerCase(),
      status: 'published',
    })
      .select('-__v')
      .lean();

    if (!project) {
      throw new AppError(
        404,
        `Project with slug '${slug}' not found or is currently not published.`,
        'https://api.portfolio.dev/errors/not-found'
      );
    }

    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');

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
