
export interface DiplomaBook {
  id: number;
  year: number; 
  name: string; 
  currentNumber: number;
}

export interface GraduationDecision {
  id: number;
  decisionNumber: string; 
  issueDate: string; 
  summary: string;
  bookId: number;
  searchCount: number; 
}

export type FieldType = 'String' | 'Number' | 'Date';

export interface CustomField {
  id: number;
  name: string;
  type: FieldType; 
  order: number;
}

export interface Diploma {
  id: number;
  bookNumber: number;
  diplomaNumber: string;
  studentCode: string;
  fullName: string; 
  birthDate: string; 
  decisionId: number; 
  customData: Record<string, any>; 
}

export interface SearchParams {
  diplomaNumber?: string;
  bookNumber?: string;
  studentCode?: string;
  fullName?: string;
  birthDate?: string;
}
