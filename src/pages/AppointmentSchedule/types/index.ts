// src/pages/appointment-booking/types/index.ts

export interface Employee {
  id: number;
  name: string;
  maxCustomersPerDay: number; // Giới hạn khách/ngày
  workSchedule: WorkSchedule[]; // Lịch làm việc
}

export interface WorkSchedule {
  dayOfWeek: number; // 0=CN, 1=T2, 2=T3...6=T7
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface Service {
  id: number;
  name: string;
  price: number; // Giá
  duration: number; // Thời gian thực hiện (phút)
}

export type AppointmentStatus = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';

export interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  serviceId: number;
  employeeId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  createdAt: string;
}

export interface Review {
  id: number;
  appointmentId: number;
  employeeId: number;
  rating: number; // 1-5 sao
  comment: string;
  reply?: string; // Phản hồi từ nhân viên
  createdAt: string;
}