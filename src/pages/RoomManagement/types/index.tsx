
export type RoomType = 'Lý thuyết' | 'Thực hành' | 'Hội trường';

export interface Room {
  id: number;
  code: string;
  name: string; 
  capacity: number;
  type: RoomType;
  manager: string;
}
