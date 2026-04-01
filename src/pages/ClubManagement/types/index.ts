// src/pages/club-management/types/index.ts

export interface Club {
  id: number;
  avatar?: string; // Ảnh đại diện
  name: string; // Tên CLB
  foundedDate: string; // Ngày thành lập (YYYY-MM-DD)
  description: string; // Mô tả (HTML)
  leader: string; // Chủ nhiệm
  active: boolean; // Hoạt động
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
export type Gender = 'Nam' | 'Nữ' | 'Khác';

export interface Application {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  skills: string; // Sở trường
  clubId: number;
  reason: string; // Lý do đăng ký
  status: ApplicationStatus;
  rejectReason?: string; // Ghi chú (lý do từ chối)
  createdAt: string;
}

export interface ActionHistory {
  id: number;
  applicationId: number;
  action: 'Approved' | 'Rejected';
  reason?: string;
  timestamp: string; // ISO string
  admin: string; // Admin thực hiện
}

export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  skills: string;
  clubId: number;
}
