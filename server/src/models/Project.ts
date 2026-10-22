import mongoose, { Schema, Document } from 'mongoose';

export type ProjectStatus = 'draft' | 'published';

export interface IProject extends Document {
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
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'fullstack',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : '';
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for high performance public querying
ProjectSchema.index({ status: 1, displayOrder: 1, createdAt: -1 });
ProjectSchema.index({ status: 1, category: 1 });
ProjectSchema.index({ status: 1, featured: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
