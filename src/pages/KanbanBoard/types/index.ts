export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string;
  priority: Priority;
  tags: string[];
  status: TaskStatus;
  createdAt: string;
}