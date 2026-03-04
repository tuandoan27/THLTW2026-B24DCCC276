
export interface Subject {
  id: number;
  name: string;
}

export interface StudySession {
  id: number;
  subjectId: number;
  subjectName: string;
  date: string; 
  startTime: string; 
  duration: number; 
  content: string;
  notes: string;
}

export interface MonthlyGoal {
  id: number;
  month: string; 
  subjectId: number | null; 
  targetHours: number;
}