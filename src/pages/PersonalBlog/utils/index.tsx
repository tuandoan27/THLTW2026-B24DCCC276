import { Post, Tag } from '../types';
 
// ===== LocalStorage =====
export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};
 
export const getFromLocalStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
 
// ===== Format =====
export const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};
 
// ===== Slug =====
export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};
 
// ===== Tag color options =====
export const TAG_COLORS = [
  'blue', 'geekblue', 'purple', 'cyan', 'green',
  'magenta', 'orange', 'red', 'gold', 'lime',
];
 
// ===== Mock data khởi tạo =====
export const INITIAL_TAGS: Tag[] = [
  { id: 1, name: 'React', color: 'blue' },
  { id: 2, name: 'TypeScript', color: 'geekblue' },
  { id: 3, name: 'UmiJS', color: 'purple' },
  { id: 4, name: 'Ant Design', color: 'cyan' },
  { id: 5, name: 'Node.js', color: 'green' },
  { id: 6, name: 'CSS', color: 'magenta' },
];
 
export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: 'Bắt đầu với React và TypeScript',
    slug: 'bat-dau-voi-react-va-typescript',
    summary: 'Hướng dẫn chi tiết cách thiết lập dự án React kết hợp TypeScript từ đầu, bao gồm cấu hình ESLint, Prettier và các best practices.',
    content: `# Bắt đầu với React và TypeScript\n\nTypeScript là một ngôn ngữ lập trình mạnh mẽ được xây dựng trên JavaScript.\n\n## Tại sao nên dùng TypeScript?\n\n- **Type Safety**: Phát hiện lỗi ngay lúc viết code\n- **IntelliSense tốt hơn**: IDE hỗ trợ autocomplete chính xác hơn\n- **Refactoring dễ dàng**: Đổi tên biến, hàm an toàn hơn\n\n## Cài đặt\n\n\`\`\`bash\nnpx create-react-app my-app --template typescript\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    tags: [1, 2],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-01-10T08:00:00Z',
    viewCount: 142,
  },
  {
    id: 2,
    title: 'UmiJS v4 - Framework mạnh mẽ cho React',
    slug: 'umijs-v4-framework-manh-me-cho-react',
    summary: 'Khám phá UmiJS v4 với routing convention-based, plugin system mạnh mẽ và tích hợp sẵn nhiều tính năng hữu ích.',
    content: `# UmiJS v4\n\nUmiJS là một extensible enterprise-level front-end application framework.\n\n## Đặc điểm nổi bật\n\n- **Convention over Configuration**: Routing tự động\n- **Plugin System**: Dễ dàng mở rộng\n- **TypeScript First**: Hỗ trợ hoàn toàn\n\n## Cấu trúc thư mục\n\n\`\`\`\nsrc/\n├── pages/\n├── components/\n└── models/\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    tags: [3, 1],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-01-15T09:00:00Z',
    viewCount: 98,
  },
  {
    id: 3,
    title: 'Ant Design - Component Library cho React',
    slug: 'ant-design-component-library-cho-react',
    summary: 'Tổng quan về Ant Design, thư viện component UI phổ biến nhất cho React với hơn 60 component sẵn có.',
    content: `# Ant Design\n\nAnt Design là một design system và React UI library.\n\n## Cài đặt\n\n\`\`\`bash\nnpm install antd\n\`\`\`\n\n## Các Component phổ biến\n\n- **Form**: Quản lý form với validation\n- **Table**: Hiển thị dữ liệu dạng bảng\n- **Modal**: Hộp thoại`,
    thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=200&fit=crop',
    tags: [4, 1],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-01-20T10:00:00Z',
    viewCount: 215,
  },
  {
    id: 4,
    title: 'Git Workflow cho nhóm làm việc',
    slug: 'git-workflow-cho-nhom-lam-viec',
    summary: 'Hướng dẫn thiết lập Git workflow hiệu quả cho nhóm, bao gồm branching strategy và commit convention.',
    content: `# Git Workflow\n\n## Gitflow\n\n- **main**: Code production\n- **develop**: Code đang phát triển\n\n## Commit Convention\n\n\`\`\`\nfeat: thêm tính năng mới\nfix: sửa bug\ndocs: cập nhật tài liệu\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop',
    tags: [],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-01-25T11:00:00Z',
    viewCount: 76,
  },
  {
    id: 5,
    title: 'REST API với Node.js và Express',
    slug: 'rest-api-voi-nodejs-va-express',
    summary: 'Xây dựng RESTful API hoàn chỉnh với Node.js, Express. Bao gồm authentication, validation và error handling.',
    content: `# REST API với Node.js\n\n## Cài đặt\n\n\`\`\`bash\nnpm install express\n\`\`\`\n\n## Server cơ bản\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\napp.listen(3000);\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
    tags: [5],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-01T08:00:00Z',
    viewCount: 183,
  },
  {
    id: 6,
    title: 'CSS Grid và Flexbox',
    slug: 'css-grid-va-flexbox',
    summary: 'Phân tích chi tiết sự khác nhau giữa CSS Grid và Flexbox, giúp bạn chọn đúng công cụ cho từng tình huống.',
    content: `# CSS Grid và Flexbox\n\n## Flexbox - 1 chiều\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: space-between;\n}\n\`\`\`\n\n## CSS Grid - 2 chiều\n\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=200&fit=crop',
    tags: [6],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-05T09:00:00Z',
    viewCount: 127,
  },
  {
    id: 7,
    title: 'Custom Hooks trong React',
    slug: 'custom-hooks-trong-react',
    summary: 'Tìm hiểu cách tạo và sử dụng Custom Hooks trong React để tái sử dụng logic giữa các component.',
    content: `# Custom Hooks\n\n## useDebounce\n\n\`\`\`typescript\nfunction useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop',
    tags: [1, 2],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-10T10:00:00Z',
    viewCount: 94,
  },
  {
    id: 8,
    title: 'Tối ưu Performance trong React',
    slug: 'toi-uu-performance-trong-react',
    summary: 'Các kỹ thuật tối ưu hiệu suất React: useMemo, useCallback, React.memo và code splitting.',
    content: `# Tối ưu Performance\n\n## React.memo\n\n\`\`\`tsx\nconst MyComponent = React.memo(({ data }) => {\n  return <div>{data}</div>;\n});\n\`\`\`\n\n## useMemo\n\n\`\`\`tsx\nconst sorted = useMemo(\n  () => [...list].sort(),\n  [list]\n);\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop',
    tags: [1, 2],
    status: 'draft',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-15T11:00:00Z',
    viewCount: 0,
  },
  {
    id: 9,
    title: 'Xây dựng Form với Ant Design',
    slug: 'xay-dung-form-voi-ant-design',
    summary: 'Hướng dẫn toàn diện về Ant Design Form: validation, dynamic fields và xử lý submit.',
    content: `# Form với Ant Design\n\n\`\`\`tsx\nconst MyForm = () => {\n  const [form] = Form.useForm();\n  return (\n    <Form form={form} onFinish={console.log}>\n      <Form.Item name="name" rules={[{ required: true }]}>\n        <Input />\n      </Form.Item>\n      <Button htmlType="submit">Gửi</Button>\n    </Form>\n  );\n};\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    tags: [4, 1],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-20T09:00:00Z',
    viewCount: 156,
  },
  {
    id: 10,
    title: 'State Management với Zustand',
    slug: 'state-management-voi-zustand',
    summary: 'Giới thiệu Zustand - thư viện state management nhẹ và đơn giản cho React.',
    content: `# Zustand\n\n## Cài đặt\n\n\`\`\`bash\nnpm install zustand\n\`\`\`\n\n## Tạo Store\n\n\`\`\`typescript\nconst useStore = create((set) => ({\n  count: 0,\n  increment: () => set((s) => ({ count: s.count + 1 })),\n}));\n\`\`\``,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    tags: [1, 2],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-25T10:00:00Z',
    viewCount: 201,
  },
];
 
export const AUTHOR = {
  name: 'Đoàn Anh Tuấn',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanauthor',
  bio: 'Sinh viên Viện Khoa học Kỹ thuật Bưu điện (RIPT). Đam mê lập trình web, yêu thích React và TypeScript.',
  skills: ['React', 'TypeScript', 'Node.js', 'UmiJS', 'Ant Design', 'Git'],
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:author@ript.edu.vn',
  },
};