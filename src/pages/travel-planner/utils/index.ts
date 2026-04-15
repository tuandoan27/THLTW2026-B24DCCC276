// src/pages/travel-planner/utils/index.ts

export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + 'đ';
};

// Get location type color
export const getLocationTypeColor = (type: string): string => {
  switch (type) {
    case 'Biển':
      return 'blue';
    case 'Núi':
      return 'green';
    case 'Thành phố':
      return 'orange';
    default:
      return 'default';
  }
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};
