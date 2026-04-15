// src/pages/travel-planner/types/index.ts

export type LocationType = 'Biển' | 'Núi' | 'Thành phố';
export type BudgetCategory = 'Ăn uống' | 'Di chuyển' | 'Lưu trú' | 'Khác';

export interface Destination {
  id: number;
  name: string;
  image?: string;
  type: LocationType;
  description: string;
  visitDuration: number; // Thời gian tham quan (giờ)
  foodCost: number; // Chi phí ăn uống
  transportCost: number; // Chi phí di chuyển
  accommodationCost: number; // Chi phí lưu trú
  rating: number; // 1-5 sao
}

export interface ItineraryItem {
  id: number;
  destinationId: number;
  day: number; // Ngày thứ mấy
  order: number; // Thứ tự trong ngày
}

export interface Itinerary {
  id: number;
  name: string;
  items: ItineraryItem[];
  totalBudget: number;
  createdAt: string;
}

export interface BudgetItem {
  category: BudgetCategory;
  amount: number;
}
