// src/pages/club-management/utils/index.ts

export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

// Format date DD/MM/YYYY
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Format datetime
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('vi-VN');
};

// Get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Approved':
      return 'success';
    case 'Rejected':
      return 'error';
    default:
      return 'default';
  }
};

// Get status label
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'Pending':
      return 'Chờ duyệt';
    case 'Approved':
      return 'Đã duyệt';
    case 'Rejected':
      return 'Từ chối';
    default:
      return status;
  }
};
