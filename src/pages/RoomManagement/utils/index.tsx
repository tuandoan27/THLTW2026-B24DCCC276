export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const getRoomTypeColor = (type: string): string => {
  switch (type) {
    case 'Lý thuyết':
      return 'blue';
    case 'Thực hành':
      return 'green';
    case 'Hội trường':
      return 'orange';
    default:
      return 'default';
  }
};

export const MANAGERS = [
  'Nguyễn Văn Khởi',
  'Đoàn Anh Tuấn',
  'Nguyễn Thị Thùy Linh',
  'Lê Hoài Nam',
];
