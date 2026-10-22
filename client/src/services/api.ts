/**
 * Portfolio CMS API Client
 * Configured with credentials: 'include' for secure HTTP-only cookie authentication
 * and 'X-Requested-With' header for CSRF protection.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface ApiProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  public status: number;
  public problem: ApiProblemDetails;

  constructor(problem: ApiProblemDetails) {
    super(problem.detail || problem.title || 'An API error occurred');
    this.status = problem.status;
    this.problem = problem;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('X-CSRF-Token', '1');

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const problem: ApiProblemDetails = data || {
      type: 'about:blank',
      title: response.statusText,
      status: response.status,
      detail: `Request failed with status ${response.status}`,
    };
    throw new ApiError(problem);
  }

  return data as T;
}

// ----------------------------------------------------
// Public APIs
// ----------------------------------------------------

export interface ProjectDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  category?: string;
  featured: boolean;
  displayOrder: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AdminProjectsResponse extends PaginatedResponse<ProjectDto> {
  counts: {
    totalAll: number;
    published: number;
    draft: number;
  };
}

export const publicApi = {
  getProjects: async (params?: { category?: string; tag?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.search) query.set('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<PaginatedResponse<ProjectDto>>(`/api/v1/projects${queryString}`);
  },

  getProjectBySlug: async (slug: string) => {
    return request<{ success: boolean; data: ProjectDto }>(`/api/v1/projects/${encodeURIComponent(slug)}`);
  },
};

// ----------------------------------------------------
// Auth APIs
// ----------------------------------------------------

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin';
}

export const authApi = {
  login: async (email: string, password: string) => {
    return request<{ success: boolean; user: AuthUser; message: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return request<{ success: boolean; message: string }>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return request<{ success: boolean; user: AuthUser }>('/api/v1/auth/me');
  },
};

// ----------------------------------------------------
// Admin Project APIs
// ----------------------------------------------------

export interface ProjectFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  thumbnailUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  category?: string;
  featured: boolean;
  displayOrder: number;
  status: 'draft' | 'published';
}

export const adminApi = {
  getProjects: async (params?: { status?: string; category?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<AdminProjectsResponse>(`/api/v1/admin/projects${queryString}`);
  },

  getProjectById: async (id: string) => {
    return request<{ success: boolean; data: ProjectDto }>(`/api/v1/admin/projects/${encodeURIComponent(id)}`);
  },

  createProject: async (data: ProjectFormData) => {
    return request<{ success: boolean; data: ProjectDto; message: string }>('/api/v1/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject: async (id: string, data: Partial<ProjectFormData>) => {
    return request<{ success: boolean; data: ProjectDto; message: string }>(`/api/v1/admin/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (id: string, status: 'draft' | 'published') => {
    return request<{ success: boolean; data: ProjectDto; message: string }>(`/api/v1/admin/projects/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  deleteProject: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/api/v1/admin/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
