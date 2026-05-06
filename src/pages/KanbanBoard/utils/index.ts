import { Task } from '../types';

export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN');

export const isOverdue = (task: Task) =>
  task.status !== 'done' && new Date(task.deadline) < new Date();

export const PRIORITY_COLOR: Record<string, string> = {
  Cao: 'red',
  'Trung bình': 'orange',
  Thấp: 'green',
};

export const COLUMN_LABELS: Record<string, string> = {
  todo: 'Cần làm',
  doing: 'Đang làm',
  done: 'Hoàn thành',
};

export const COLUMN_COLORS: Record<string, string> = {
  todo: '#1890ff',
  doing: '#fa8c16',
  done: '#52c41a',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    name: 'Thiết kế giao diện trang chủ',
    description: 'Tạo mockup và thiết kế UI cho trang chủ',
    deadline: '2025-05-10',
    priority: 'Cao',
    tags: ['UI', 'Design'],
    status: 'done',
    createdAt: '2025-04-01',
  },
  {
    id: '2',
    name: 'Xây dựng API đăng nhập',
    description: 'Tạo API login, register với JWT',
    deadline: '2025-05-15',
    priority: 'Cao',
    tags: ['Backend', 'API'],
    status: 'doing',
    createdAt: '2025-04-02',
  },
  {
    id: '3',
    name: 'Viết unit test cho module thanh toán',
    description: 'Viết test cho các hàm xử lý thanh toán',
    deadline: '2025-05-08',
    priority: 'Trung bình',
    tags: ['Testing'],
    status: 'todo',
    createdAt: '2025-04-03',
  },
  {
    id: '4',
    name: 'Tối ưu truy vấn database',
    description: 'Review và tối ưu các câu query chậm',
    deadline: '2025-05-20',
    priority: 'Trung bình',
    tags: ['Backend', 'Database'],
    status: 'todo',
    createdAt: '2025-04-04',
  },
  {
    id: '5',
    name: 'Cập nhật tài liệu API',
    description: 'Viết Swagger docs cho toàn bộ API',
    deadline: '2025-05-25',
    priority: 'Thấp',
    tags: ['Docs'],
    status: 'todo',
    createdAt: '2025-04-05',
  },
  {
    id: '6',
    name: 'Fix bug trang thanh toán',
    description: 'Sửa lỗi hiển thị sai giá trên mobile',
    deadline: '2025-05-12',
    priority: 'Cao',
    tags: ['Bug', 'Frontend'],
    status: 'doing',
    createdAt: '2025-04-06',
  },
];