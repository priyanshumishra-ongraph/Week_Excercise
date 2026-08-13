import mongoose, { Schema, Document } from 'mongoose';
import type { IUser } from './user.model.js';

export interface ITask extends Document {
  id?: string;
  title: string;
  completed: boolean;
  priority: string;
  progress_label: string;
  progress_stats: string;
  progress_bar_fill: number;
  due_date: string | Date;
  assignee_initials_list: string[];
  created_at: string;
  assignee_names: string[];
  user: mongoose.Types.ObjectId | IUser; // Reference to User
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: 'Low' },
  progress_label: { type: String, default: 'New Task' },
  progress_stats: { type: String, default: '0%' },
  progress_bar_fill: { type: Number, default: 0 },
  due_date: { type: Schema.Types.Mixed, default: Date.now },
  assignee_initials_list: { type: [String], default: ['U'] },
  created_at: { type: String, default: () => new Date().toISOString() },
  assignee_names: { type: [String], default: ['Unknown User'] },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    const { _id, ...rest } = ret;
    return { ...rest, id: _id };
  }
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
