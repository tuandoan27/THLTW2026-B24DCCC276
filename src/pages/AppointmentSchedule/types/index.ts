export interface Employee {
  id: number;
  name: string;
  maxCustomersPerDay: number; 
  workSchedule: WorkSchedule[];
}

export interface WorkSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string; 
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export type AppointmentStatus = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';

export interface Appointment {
  id: number;
  customerName: string;
  customerPhone: string;
  serviceId: number;
  employeeId: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Review {
  id: number;
  appointmentId: number;
  employeeId: number;
  rating: number;
  comment: string;
  reply?: string;
  createdAt: string;
}