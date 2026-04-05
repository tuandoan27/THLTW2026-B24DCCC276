
export interface Club {
  id: number;
  avatar?: string; 
  name: string;
  foundedDate: string; 
  description: string; 
  leader: string; 
  active: boolean; 
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
  skills: string; 
  clubId: number;
  reason: string; 
  status: ApplicationStatus;
  rejectReason?: string; 
  createdAt: string;
}

export interface ActionHistory {
  id: number;
  applicationId: number;
  action: 'Approved' | 'Rejected';
  reason?: string;
  timestamp: string;
  admin: string; 
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
