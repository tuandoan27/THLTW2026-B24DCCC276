
export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const validateSearchParams = (params: any): boolean => {
  const filledParams = Object.values(params).filter(
    (v) => v !== undefined && v !== null && v !== '',
  );
  return filledParams.length >= 2;
};

export const getFieldTypeLabel = (type: string): string => {
  switch (type) {
    case 'String':
      return 'Văn bản';
    case 'Number':
      return 'Số';
    case 'Date':
      return 'Ngày';
    default:
      return type;
  }
};
