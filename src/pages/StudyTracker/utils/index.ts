
import type { StudySession } from '../types';

export const saveToLocalStorage = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const calculateMonthlyStudyTime = (
  sessions: StudySession[],
  month: string,
  subjectId?: number,
): number => {
  return sessions
    .filter((session) => {
      const sessionMonth = session.date.substring(0, 7);
      const matchMonth = sessionMonth === month;
      const matchSubject = subjectId ? session.subjectId === subjectId : true;
      return matchMonth && matchSubject;
    })
    .reduce((total, session) => total + session.duration, 0);
};

export const minutesToHours = (minutes: number): number => {
  return Math.round((minutes / 60) * 10) / 10;
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const formatMonth = (month: string): string => {
  const [year, monthNum] = month.split('-');
  return `${monthNum}/${year}`;
};