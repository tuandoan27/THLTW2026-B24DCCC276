// src/pages/question-bank/types/index.ts

export interface KnowledgeBlock {
  id: number;
  name: string; // VD: Tổng quan, Chuyên sâu
}

export interface Subject {
  id: number;
  code: string; // Mã môn
  name: string; // Tên môn
  credits: number; // Số tín chỉ
}

export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface Question {
  id: number;
  code: string; // Mã câu hỏi
  subjectId: number;
  content: string; // Nội dung câu hỏi
  difficulty: Difficulty;
  knowledgeBlockId: number;
}

export interface ExamStructureItem {
  difficulty: Difficulty;
  knowledgeBlockId: number;
  quantity: number; // Số lượng câu
}

export interface ExamStructure {
  id: number;
  name: string; // Tên cấu trúc
  subjectId: number;
  items: ExamStructureItem[];
}

export interface Exam {
  id: number;
  name: string; // Tên đề thi
  subjectId: number;
  structureId: number;
  questions: Question[];
  createdAt: string;
}