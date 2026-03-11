// src/pages/question-bank/utils/index.ts

export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Dễ':
      return 'success';
    case 'Trung bình':
      return 'processing';
    case 'Khó':
      return 'warning';
    case 'Rất khó':
      return 'error';
    default:
      return 'default';
  }
};