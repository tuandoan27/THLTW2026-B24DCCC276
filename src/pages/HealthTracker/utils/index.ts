import { Exercise, Goal, HealthLog, Workout } from '../types';

export const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorage = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN');

export const calcBMI = (weight: number, height: number) => {
  const h = height / 100;
  return parseFloat((weight / (h * h)).toFixed(1));
};

export const getBMITag = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
  return { label: 'Béo phì', color: 'red' };
};

export const DIFFICULTY_COLOR: Record<string, string> = {
  Dễ: 'green',
  'Trung bình': 'orange',
  Khó: 'red',
};

export const INITIAL_WORKOUTS: Workout[] = [
  { id: 1, date: '2025-03-01', type: 'Cardio', duration: 45, calories: 350, note: 'Chạy bộ buổi sáng', status: 'Hoàn thành' },
  { id: 2, date: '2025-03-03', type: 'Strength', duration: 60, calories: 420, note: 'Tập ngực và tay', status: 'Hoàn thành' },
  { id: 3, date: '2025-03-05', type: 'Yoga', duration: 30, calories: 150, note: '', status: 'Hoàn thành' },
  { id: 4, date: '2025-03-07', type: 'HIIT', duration: 25, calories: 300, note: 'Tabata 8 hiệp', status: 'Bỏ lỡ' },
  { id: 5, date: '2025-03-10', type: 'Cardio', duration: 50, calories: 380, note: 'Đạp xe', status: 'Hoàn thành' },
  { id: 6, date: '2025-03-12', type: 'Strength', duration: 65, calories: 450, note: 'Tập lưng và vai', status: 'Hoàn thành' },
  { id: 7, date: '2025-03-15', type: 'HIIT', duration: 30, calories: 360, note: '', status: 'Hoàn thành' },
  { id: 8, date: '2025-03-18', type: 'Yoga', duration: 45, calories: 200, note: 'Yoga buổi tối', status: 'Hoàn thành' },
  { id: 9, date: '2025-03-20', type: 'Cardio', duration: 40, calories: 310, note: 'Chạy bộ', status: 'Hoàn thành' },
  { id: 10, date: '2025-03-22', type: 'Other', duration: 60, calories: 250, note: 'Bơi lội', status: 'Hoàn thành' },
];

export const INITIAL_HEALTH_LOGS: HealthLog[] = [
  { id: 1, date: '2025-03-01', weight: 72, height: 170, heartRate: 68, sleepHours: 7 },
  { id: 2, date: '2025-03-05', weight: 71.5, height: 170, heartRate: 67, sleepHours: 7.5 },
  { id: 3, date: '2025-03-10', weight: 71, height: 170, heartRate: 66, sleepHours: 8 },
  { id: 4, date: '2025-03-15', weight: 70.5, height: 170, heartRate: 65, sleepHours: 7 },
  { id: 5, date: '2025-03-20', weight: 70, height: 170, heartRate: 64, sleepHours: 7.5 },
];

export const INITIAL_GOALS: Goal[] = [
  { id: 1, name: 'Giảm 5kg', type: 'Giảm cân', targetValue: 5, currentValue: 2, deadline: '2025-06-01', status: 'Đang thực hiện' },
  { id: 2, name: 'Chạy 5km không nghỉ', type: 'Cải thiện sức bền', targetValue: 5, currentValue: 5, deadline: '2025-04-01', status: 'Đã đạt' },
  { id: 3, name: 'Tập 20 buổi/tháng', type: 'Khác', targetValue: 20, currentValue: 10, deadline: '2025-03-31', status: 'Đang thực hiện' },
];

export const INITIAL_EXERCISES: Exercise[] = [
  { id: 1, name: 'Push Up', muscleGroup: 'Chest', difficulty: 'Dễ', description: 'Bài tập hít đất cơ bản', instructions: '1. Nằm sấp, tay rộng bằng vai\n2. Đẩy người lên bằng tay\n3. Hạ người xuống từ từ\n4. Lặp lại 10-15 lần', caloriesPerHour: 300 },
  { id: 2, name: 'Pull Up', muscleGroup: 'Back', difficulty: 'Khó', description: 'Bài tập kéo xà đơn', instructions: '1. Bám xà, tay rộng hơn vai\n2. Kéo người lên cho đến khi cằm qua xà\n3. Hạ xuống từ từ\n4. Lặp lại 5-10 lần', caloriesPerHour: 350 },
  { id: 3, name: 'Squat', muscleGroup: 'Legs', difficulty: 'Dễ', description: 'Bài tập squat cơ bản', instructions: '1. Đứng thẳng, chân rộng bằng vai\n2. Ngồi xuống như ngồi ghế\n3. Đùi song song với sàn\n4. Đứng dậy và lặp lại', caloriesPerHour: 280 },
  { id: 4, name: 'Plank', muscleGroup: 'Core', difficulty: 'Trung bình', description: 'Bài tập plank giữ thân', instructions: '1. Nằm sấp, chống tay\n2. Giữ thân thẳng\n3. Giữ 30-60 giây\n4. Nghỉ và lặp lại', caloriesPerHour: 250 },
  { id: 5, name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Trung bình', description: 'Đẩy tạ vai', instructions: '1. Ngồi hoặc đứng\n2. Cầm tạ ngang tai\n3. Đẩy thẳng lên trên\n4. Hạ xuống từ từ', caloriesPerHour: 320 },
  { id: 6, name: 'Bicep Curl', muscleGroup: 'Arms', difficulty: 'Dễ', description: 'Tập tay trước với tạ', instructions: '1. Đứng thẳng, cầm tạ\n2. Cuộn tay lên vai\n3. Hạ xuống chậm\n4. Lặp lại 12-15 lần', caloriesPerHour: 240 },
  { id: 7, name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'Khó', description: 'Bài tập toàn thân cường độ cao', instructions: '1. Đứng thẳng\n2. Ngồi xuống chống tay\n3. Bật chân ra sau\n4. Hít đất 1 cái\n5. Bật chân về nhảy lên', caloriesPerHour: 600 },
  { id: 8, name: 'Running', muscleGroup: 'Full Body', difficulty: 'Trung bình', description: 'Chạy bộ cardio', instructions: '1. Khởi động 5 phút\n2. Chạy nhịp đều\n3. Thở đều qua mũi\n4. Kéo giãn sau khi chạy', caloriesPerHour: 500 },
];