import { Post, Tag } from '../types';

export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T,>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN');

export const TAG_COLORS = [
  'blue', 'geekblue', 'purple', 'cyan', 'green', 'magenta', 'orange', 'red',
];

export const AUTHOR = {
  name: 'Đoàn Anh Tuấn',
  bio: 'Sinh viên Viện Khoa học Kỹ thuật Bưu điện (RIPT). Đam mê lập trình web.',
  skills: ['React', 'TypeScript', 'Node.js', 'UmiJS', 'Ant Design', 'Git'],
  social: {
    github: 'https://github.com',
  },
};

export const INITIAL_TAGS: Tag[] = [
  { id: 1, name: 'React', color: 'blue' },
  { id: 2, name: 'TypeScript', color: 'geekblue' },
  { id: 3, name: 'UmiJS', color: 'purple' },
  { id: 4, name: 'CSS', color: 'magenta' },
  { id: 5, name: 'Node.js', color: 'green' },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: 'Bắt đầu với React và TypeScript',
    slug: 'bat-dau-voi-react-typescript',
    summary: 'Hướng dẫn thiết lập dự án React kết hợp TypeScript từ đầu.',
    content: '# Bắt đầu với React và TypeScript\n\nTypeScript giúp code an toàn hơn với hệ thống kiểu tĩnh.\n\n## Cài đặt\n\n```bash\nnpx create-react-app my-app --template typescript\n```\n\n## Lợi ích\n\n- Phát hiện lỗi sớm\n- Autocomplete tốt hơn\n- Dễ bảo trì',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    tags: [1, 2],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-01-10T08:00:00Z',
    viewCount: 120,
  },
  {
    id: 2,
    title: 'Hướng dẫn UmiJS v4',
    slug: 'huong-dan-umijs-v4',
    summary: 'Tổng quan về UmiJS v4 với routing convention-based và plugin system.',
    content: '# UmiJS v4\n\nUmiJS là framework React mạnh mẽ của Ant Design.\n\n## Đặc điểm\n\n- Routing theo thư mục\n- Hỗ trợ TypeScript\n- Plugin phong phú\n\n## Cấu trúc\n\n```\nsrc/pages/   # tự tạo routes\nsrc/models/  # state\n```',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    tags: [3, 1],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-01-20T09:00:00Z',
    viewCount: 85,
  },
  {
    id: 3,
    title: 'CSS Grid và Flexbox',
    slug: 'css-grid-va-flexbox',
    summary: 'So sánh CSS Grid và Flexbox, khi nào dùng cái nào.',
    content: '# CSS Grid và Flexbox\n\n## Flexbox\n\nDùng cho layout 1 chiều.\n\n```css\n.box { display: flex; gap: 16px; }\n```\n\n## Grid\n\nDùng cho layout 2 chiều.\n\n```css\n.grid { display: grid; grid-template-columns: repeat(3, 1fr); }\n```',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=200&fit=crop',
    tags: [4],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-01T10:00:00Z',
    viewCount: 60,
  },
  {
    id: 4,
    title: 'REST API với Node.js',
    slug: 'rest-api-voi-nodejs',
    summary: 'Xây dựng REST API đơn giản với Node.js và Express.',
    content: '# REST API với Node.js\n\n## Cài đặt\n\n```bash\nnpm install express\n```\n\n## Tạo server\n\n```js\nconst express = require("express");\nconst app = express();\napp.get("/api", (req, res) => res.json({ ok: true }));\napp.listen(3000);\n```',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop',
    tags: [5],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-10T08:00:00Z',
    viewCount: 74,
  },
  {
    id: 5,
    title: 'Git cơ bản cho sinh viên',
    slug: 'git-co-ban-cho-sinh-vien',
    summary: 'Hướng dẫn sử dụng Git từ đầu: init, commit, branch, merge và làm việc với GitLab.',
    content: '# Git cơ bản\n\n## Các lệnh hay dùng\n\n```bash\ngit init\ngit add .\ngit commit -m "feat: add feature"\ngit push origin main\n```\n\n## Branch\n\n```bash\ngit checkout -b feature/ten-tinh-nang\ngit merge develop\n```',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=200&fit=crop',
    tags: [],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-15T08:00:00Z',
    viewCount: 55,
  },
  {
    id: 6,
    title: 'useState và useEffect trong React',
    slug: 'usestate-va-useeffect-trong-react',
    summary: 'Tìm hiểu hai hooks cơ bản nhất trong React: useState để quản lý state và useEffect để xử lý side effects.',
    content: '# useState và useEffect\n\n## useState\n\n```tsx\nconst [count, setCount] = useState(0);\n```\n\n## useEffect\n\n```tsx\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\n## Cleanup\n\n```tsx\nuseEffect(() => {\n  const timer = setInterval(() => {}, 1000);\n  return () => clearInterval(timer);\n}, []);\n```',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop',
    tags: [1, 2],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-02-20T09:00:00Z',
    viewCount: 98,
  },
  {
    id: 7,
    title: 'Ant Design Form và Validation',
    slug: 'ant-design-form-va-validation',
    summary: 'Cách sử dụng Form của Ant Design để tạo form với validation, submit và reset dữ liệu.',
    content: '# Ant Design Form\n\n```tsx\nconst [form] = Form.useForm();\n\nreturn (\n  <Form form={form} onFinish={(values) => console.log(values)}>\n    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>\n      <Input />\n    </Form.Item>\n    <Button htmlType="submit" type="primary">Gửi</Button>\n  </Form>\n);\n```',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
    tags: [1],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-03-01T10:00:00Z',
    viewCount: 112,
  },
  {
    id: 8,
    title: 'LocalStorage trong JavaScript',
    slug: 'localstorage-trong-javascript',
    summary: 'Hướng dẫn lưu và đọc dữ liệu với localStorage, sessionStorage trong trình duyệt.',
    content: '# LocalStorage\n\n## Lưu dữ liệu\n\n```js\nlocalStorage.setItem("key", JSON.stringify(data));\n```\n\n## Đọc dữ liệu\n\n```js\nconst data = JSON.parse(localStorage.getItem("key"));\n```\n\n## Xóa\n\n```js\nlocalStorage.removeItem("key");\nlocalStorage.clear();\n```',
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop',
    tags: [],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-03-05T08:00:00Z',
    viewCount: 67,
  },
  {
    id: 9,
    title: 'TypeScript Interface vs Type',
    slug: 'typescript-interface-vs-type',
    summary: 'So sánh Interface và Type trong TypeScript, khi nào nên dùng cái nào cho phù hợp.',
    content: '# Interface vs Type\n\n## Interface\n\n```ts\ninterface User {\n  id: number;\n  name: string;\n}\n```\n\n## Type\n\n```ts\ntype Status = "active" | "inactive";\ntype User = { id: number; name: string };\n```\n\n## Khi nào dùng?\n\n- Dùng **interface** cho object, class\n- Dùng **type** cho union, primitive',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    tags: [2],
    status: 'published',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-03-10T09:00:00Z',
    viewCount: 89,
  },
  {
    id: 10,
    title: 'Responsive Design với CSS',
    slug: 'responsive-design-voi-css',
    summary: 'Cách làm website responsive với media queries, viewport và các kỹ thuật CSS hiện đại.',
    content: '# Responsive Design\n\n## Media Query\n\n```css\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}\n```\n\n## Viewport\n\n```html\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n```',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=200&fit=crop',
    tags: [4],
    status: 'draft',
    author: 'Đoàn Anh Tuấn',
    createdAt: '2025-03-15T10:00:00Z',
    viewCount: 0,
  },
];