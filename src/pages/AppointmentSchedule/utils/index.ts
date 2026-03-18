
import type { Appointment, Employee, Review, WorkSchedule } from '../types';

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

export const formatDateTime = (date: string, time: string): string => {
  return `${formatDate(date)} ${time}`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Chờ duyệt':
      return 'default';
    case 'Xác nhận':
      return 'processing';
    case 'Hoàn thành':
      return 'success';
    case 'Hủy':
      return 'error';
    default:
      return 'default';
  }
};

export const checkAppointmentConflict = (
  appointments: Appointment[],
  employeeId: number,
  date: string,
  time: string,
  excludeId?: number,
): boolean => {
  return appointments.some(
    (apt) =>
      apt.id !== excludeId &&
      apt.employeeId === employeeId &&
      apt.date === date &&
      apt.time === time &&
      apt.status !== 'Hủy',
  );
};

export const checkEmployeeDailyLimit = (
  appointments: Appointment[],
  employee: Employee,
  date: string,
  excludeId?: number,
): boolean => {
  const count = appointments.filter(
    (apt) =>
      apt.id !== excludeId &&
      apt.employeeId === employee.id &&
      apt.date === date &&
      apt.status !== 'Hủy',
  ).length;
  return count >= employee.maxCustomersPerDay;
};

export const isEmployeeWorking = (
  employee: Employee,
  date: string,
  time: string,
): boolean => {
  const dayOfWeek = new Date(date).getDay();
  const schedule = employee.workSchedule.find((s) => s.dayOfWeek === dayOfWeek);
  if (!schedule) return false;
  return time >= schedule.startTime && time <= schedule.endTime;
};

export const calculateAverageRating = (
  reviews: Review[],
  employeeId: number,
): number => {
  const employeeReviews = reviews.filter((r) => r.employeeId === employeeId);
  if (employeeReviews.length === 0) return 0;
  const sum = employeeReviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / employeeReviews.length) * 10) / 10;
};

export const getDayName = (dayOfWeek: number): string => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[dayOfWeek];
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + 'đ';
};