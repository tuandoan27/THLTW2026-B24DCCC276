export type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type WorkoutStatus = 'Hoàn thành' | 'Bỏ lỡ';
export type GoalType = 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
export type GoalStatus = 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

export interface Workout {
  id: number;
  date: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  note: string;
  status: WorkoutStatus;
}

export interface HealthLog {
  id: number;
  date: string;
  weight: number;
  height: number;
  heartRate: number;
  sleepHours: number;
}

export interface Goal {
  id: number;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
}

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  instructions: string;
  caloriesPerHour: number;
}