import {
  Badge, Button, Card, Col, DatePicker, Empty, Input, InputNumber,
  message, Modal, Popconfirm, Progress, Radio, Row,
  Select, Space, Table, Tag, Tabs, Timeline, Typography,
} from 'antd';
import ReactApexChart from 'react-apexcharts';
import {
  DeleteOutlined, EditOutlined, FireOutlined,
  PlusOutlined, SearchOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Exercise, Goal, GoalStatus, HealthLog, Workout, WorkoutType } from './types';
import WorkoutForm from './components/WorkoutForm';
import HealthForm from './components/HealthForm';
import GoalForm from './components/GoalForm';
import ExerciseForm from './components/ExerciseForm';
import {
  calcBMI, DIFFICULTY_COLOR, formatDate,
  getBMITag, getFromLocalStorage, INITIAL_EXERCISES,
  INITIAL_GOALS, INITIAL_HEALTH_LOGS, INITIAL_WORKOUTS,
  saveToLocalStorage,
} from './utils';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const HealthTracker: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => getFromLocalStorage('ht_workouts', INITIAL_WORKOUTS));
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>(() => getFromLocalStorage('ht_health', INITIAL_HEALTH_LOGS));
  const [goals, setGoals] = useState<Goal[]>(() => getFromLocalStorage('ht_goals', INITIAL_GOALS));
  const [exercises, setExercises] = useState<Exercise[]>(() => getFromLocalStorage('ht_exercises', INITIAL_EXERCISES));

  // workout modal
  const [workoutModal, setWorkoutModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isEditWorkout, setIsEditWorkout] = useState(false);

  // workout filters
  const [workoutSearch, setWorkoutSearch] = useState('');
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState<WorkoutType | 'all'>('all');
  const [workoutDateRange, setWorkoutDateRange] = useState<any>(null);

  // health modal
  const [healthModal, setHealthModal] = useState(false);
  const [editingHealth, setEditingHealth] = useState<HealthLog | null>(null);
  const [isEditHealth, setIsEditHealth] = useState(false);

  // goal drawer
  const [goalDrawer, setGoalDrawer] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isEditGoal, setIsEditGoal] = useState(false);
  const [goalFilter, setGoalFilter] = useState<GoalStatus | 'Tất cả'>('Tất cả');

  // exercise modal
  const [exerciseModal, setExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isEditExercise, setIsEditExercise] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseMuscle, setExerciseMuscle] = useState<string>('all');
  const [exerciseDifficulty, setExerciseDifficulty] = useState<string>('all');
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

  useEffect(() => { saveToLocalStorage('ht_workouts', workouts); }, [workouts]);
  useEffect(() => { saveToLocalStorage('ht_health', healthLogs); }, [healthLogs]);
  useEffect(() => { saveToLocalStorage('ht_goals', goals); }, [goals]);
  useEffect(() => { saveToLocalStorage('ht_exercises', exercises); }, [exercises]);

  // ===== DASHBOARD =====
  const now = dayjs();
  const thisMonthWorkouts = workouts.filter((w) =>
    dayjs(w.date).month() === now.month() && dayjs(w.date).year() === now.year()
  );
  const totalCalories = thisMonthWorkouts.reduce((s, w) => s + w.calories, 0);

  const calcStreak = () => {
    const sorted = [...workouts]
      .filter((w) => w.status === 'Hoàn thành')
      .sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    let current = dayjs();
    for (const w of sorted) {
      if (dayjs(w.date).isSame(current, 'day') || dayjs(w.date).isSame(current.subtract(1, 'day'), 'day')) {
        streak++;
        current = dayjs(w.date);
      } else break;
    }
    return streak;
  };

  const goalProgress = goals.length > 0
    ? Math.round((goals.filter((g) => g.status === 'Đã đạt').length / goals.length) * 100)
    : 0;

  // ApexCharts - biểu đồ cột buổi tập theo tuần
  const weekCounts = [1, 2, 3, 4].map((week) =>
    thisMonthWorkouts.filter((w) => {
      const day = dayjs(w.date).date();
      return day >= (week - 1) * 7 + 1 && day <= week * 7;
    }).length
  );

  const columnChartOptions: any = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'] },
    colors: ['#1890ff'],
    dataLabels: { enabled: true },
    plotOptions: { bar: { borderRadius: 4 } },
  };

  const columnChartSeries = [{ name: 'Buổi tập', data: weekCounts }];

  // ApexCharts - biểu đồ đường cân nặng
  const sortedLogs = [...healthLogs].sort((a, b) => a.date.localeCompare(b.date));
  const weightDates = sortedLogs.map((l) => formatDate(l.date));
  const weightValues = sortedLogs.map((l) => l.weight);

  const lineChartOptions: any = {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: { categories: weightDates },
    colors: ['#52c41a'],
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4 },
    dataLabels: { enabled: false },
  };

  const lineChartSeries = [{ name: 'Cân nặng (kg)', data: weightValues }];

  const recent5 = [...workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // ===== WORKOUT CRUD =====
  const handleAddWorkout = (values: any) => {
    setWorkouts((prev) => [{ id: Date.now(), ...values }, ...prev]);
    message.success('Thêm buổi tập thành công');
    setWorkoutModal(false);
  };

  const handleEditWorkout = (values: any) => {
    if (!editingWorkout) return;
    setWorkouts((prev) => prev.map((w) => w.id === editingWorkout.id ? { ...w, ...values } : w));
    message.success('Cập nhật thành công');
    setWorkoutModal(false);
    setEditingWorkout(null);
  };

  const handleDeleteWorkout = (id: number) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    message.success('Đã xóa');
  };

  // ===== HEALTH CRUD =====
  const handleAddHealth = (values: any) => {
    setHealthLogs((prev) => [{ id: Date.now(), ...values }, ...prev]);
    message.success('Thêm chỉ số thành công');
    setHealthModal(false);
  };

  const handleEditHealth = (values: any) => {
    if (!editingHealth) return;
    setHealthLogs((prev) => prev.map((h) => h.id === editingHealth.id ? { ...h, ...values } : h));
    message.success('Cập nhật thành công');
    setHealthModal(false);
    setEditingHealth(null);
  };

  const handleDeleteHealth = (id: number) => {
    setHealthLogs((prev) => prev.filter((h) => h.id !== id));
    message.success('Đã xóa');
  };

  // ===== GOAL CRUD =====
  const handleAddGoal = (values: any) => {
    setGoals((prev) => [...prev, { id: Date.now(), ...values }]);
    message.success('Thêm mục tiêu thành công');
    setGoalDrawer(false);
  };

  const handleEditGoal = (values: any) => {
    if (!editingGoal) return;
    setGoals((prev) => prev.map((g) => g.id === editingGoal.id ? { ...g, ...values } : g));
    message.success('Cập nhật thành công');
    setGoalDrawer(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    message.success('Đã xóa');
  };

  const handleUpdateCurrentValue = (id: number, value: number) => {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, currentValue: value } : g));
  };

  // ===== EXERCISE CRUD =====
  const handleAddExercise = (values: any) => {
    setExercises((prev) => [...prev, { id: Date.now(), ...values }]);
    message.success('Thêm bài tập thành công');
    setExerciseModal(false);
  };

  const handleEditExercise = (values: any) => {
    if (!editingExercise) return;
    setExercises((prev) => prev.map((e) => e.id === editingExercise.id ? { ...e, ...values } : e));
    message.success('Cập nhật thành công');
    setExerciseModal(false);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (id: number) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    message.success('Đã xóa');
  };

  // ===== FILTERS =====
  const filteredWorkouts = workouts.filter((w) => {
    const matchSearch = !workoutSearch || w.type.toLowerCase().includes(workoutSearch.toLowerCase()) || w.note.toLowerCase().includes(workoutSearch.toLowerCase());
    const matchType = workoutTypeFilter === 'all' || w.type === workoutTypeFilter;
    const matchDate = !workoutDateRange || (
      dayjs(w.date).isAfter(dayjs(workoutDateRange[0]).subtract(1, 'day')) &&
      dayjs(w.date).isBefore(dayjs(workoutDateRange[1]).add(1, 'day'))
    );
    return matchSearch && matchType && matchDate;
  });

  const filteredGoals = goals.filter((g) => goalFilter === 'Tất cả' || g.status === goalFilter);

  const filteredExercises = exercises.filter((e) => {
    const matchSearch = !exerciseSearch || e.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchMuscle = exerciseMuscle === 'all' || e.muscleGroup === exerciseMuscle;
    const matchDiff = exerciseDifficulty === 'all' || e.difficulty === exerciseDifficulty;
    return matchSearch && matchMuscle && matchDiff;
  });

  // ===== TABLE COLUMNS =====
  const workoutColumns = [
    { title: 'Ngày', dataIndex: 'date', width: 110, render: (d: string) => formatDate(d) },
    { title: 'Loại bài tập', dataIndex: 'type', width: 120 },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', width: 150 },
    { title: 'Calo đốt', dataIndex: 'calories', width: 100 },
    { title: 'Ghi chú', dataIndex: 'note', ellipsis: true },
    {
      title: 'Trạng thái', dataIndex: 'status', width: 130,
      render: (s: string) => <Badge status={s === 'Hoàn thành' ? 'success' : 'error'} text={s} />,
    },
    {
      title: 'Thao tác', width: 100,
      render: (_: any, record: Workout) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingWorkout(record); setIsEditWorkout(true); setWorkoutModal(true); }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDeleteWorkout(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const healthColumns = [
    { title: 'Ngày', dataIndex: 'date', width: 110, render: (d: string) => formatDate(d) },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', width: 130 },
    { title: 'Chiều cao (cm)', dataIndex: 'height', width: 130 },
    {
      title: 'BMI', width: 160,
      render: (_: any, r: HealthLog) => {
        const bmi = calcBMI(r.weight, r.height);
        const { label, color } = getBMITag(bmi);
        return <Space><Text>{bmi}</Text><Tag color={color}>{label}</Tag></Space>;
      },
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'heartRate', width: 130 },
    { title: 'Giờ ngủ', dataIndex: 'sleepHours', width: 100 },
    {
      title: 'Thao tác', width: 100,
      render: (_: any, record: HealthLog) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingHealth(record); setIsEditHealth(true); setHealthModal(true); }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDeleteHealth(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const goalStatusColor: Record<string, string> = { 'Đang thực hiện': 'blue', 'Đã đạt': 'green', 'Đã hủy': 'red' };

  return (
    <div style={{ padding: 24 }}>
      <h1>Health Tracker</h1>

      <Tabs defaultActiveKey="dashboard">

        {/* ========== DASHBOARD ========== */}
        <TabPane tab="Dashboard" key="dashboard">
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#1890ff', margin: 0 }}>{thisMonthWorkouts.length}</Title>
                  <Text type="secondary">Tổng buổi tập tháng này</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}><FireOutlined /> {totalCalories}</Title>
                  <Text type="secondary">Tổng calo đã đốt</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#52c41a', margin: 0 }}>{calcStreak()}</Title>
                  <Text type="secondary">Số ngày tập liên tiếp</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div style={{ textAlign: 'center' }}>
                  <Title level={2} style={{ color: '#fa8c16', margin: 0 }}><TrophyOutlined /> {goalProgress}%</Title>
                  <Text type="secondary">Mục tiêu hoàn thành</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Buổi tập theo tuần trong tháng">
                <ReactApexChart type="bar" options={columnChartOptions} series={columnChartSeries} height={220} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Thay đổi cân nặng">
                {weightValues.length < 2 ? (
                  <Empty description="Cần ít nhất 2 bản ghi" style={{ height: 220 }} />
                ) : (
                  <ReactApexChart type="line" options={lineChartOptions} series={lineChartSeries} height={220} />
                )}
              </Card>
            </Col>
          </Row>

          <Card title="5 buổi tập gần nhất">
            {recent5.length === 0 ? <Empty description="Chưa có buổi tập nào" /> : (
              <Timeline>
                {recent5.map((w) => (
                  <Timeline.Item key={w.id} color={w.status === 'Hoàn thành' ? 'green' : 'red'}>
                    <Text strong>{w.type}</Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>{formatDate(w.date)}</Text>
                    <br />
                    <Text type="secondary">{w.duration} phút · {w.calories} calo</Text>
                    {w.note && <><br /><Text type="secondary">{w.note}</Text></>}
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </TabPane>

        {/* ========== NHẬT KÝ TẬP LUYỆN ========== */}
        <TabPane tab="Nhật ký tập luyện" key="workouts">
          <Card extra={
            <Space wrap>
              <Input prefix={<SearchOutlined />} placeholder="Tìm bài tập..." value={workoutSearch} onChange={(e) => setWorkoutSearch(e.target.value)} allowClear style={{ width: 180 }} />
              <Select value={workoutTypeFilter} onChange={setWorkoutTypeFilter} style={{ width: 130 }}
                options={[{ value: 'all', label: 'Tất cả loại' }, ...['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'].map((v) => ({ value: v, label: v }))]}
              />
              <RangePicker format="DD/MM/YYYY" onChange={(dates) => setWorkoutDateRange(dates)} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingWorkout(null); setIsEditWorkout(false); setWorkoutModal(true); }}>Thêm buổi tập</Button>
            </Space>
          }>
            <Table rowKey="id" columns={workoutColumns} dataSource={filteredWorkouts} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
          </Card>
        </TabPane>

        {/* ========== NHẬT KÝ SỨC KHỎE ========== */}
        <TabPane tab="Nhật ký sức khỏe" key="health">
          <Card extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingHealth(null); setIsEditHealth(false); setHealthModal(true); }}>Thêm chỉ số</Button>
          }>
            <Table rowKey="id" columns={healthColumns} dataSource={healthLogs} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
          </Card>
        </TabPane>

        {/* ========== MỤC TIÊU ========== */}
        <TabPane tab="Mục tiêu" key="goals">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <Radio.Group value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)} buttonStyle="solid">
              {(['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy'] as const).map((v) => (
                <Radio.Button key={v} value={v}>{v}</Radio.Button>
              ))}
            </Radio.Group>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingGoal(null); setIsEditGoal(false); setGoalDrawer(true); }}>Thêm mục tiêu</Button>
          </div>

          {filteredGoals.length === 0 ? <Empty description="Không có mục tiêu nào" /> : (
            <Row gutter={[16, 16]}>
              {filteredGoals.map((goal) => {
                const percent = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
                return (
                  <Col xs={24} sm={12} lg={8} key={goal.id}>
                    <Card
                      extra={
                        <Space>
                          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingGoal(goal); setIsEditGoal(true); setGoalDrawer(true); }} />
                          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDeleteGoal(goal.id)} okText="Xóa" cancelText="Hủy">
                            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Space>
                      }
                    >
                      <Tag color={goalStatusColor[goal.status]} style={{ marginBottom: 8 }}>{goal.status}</Tag>
                      <Title level={5} style={{ marginBottom: 4 }}>{goal.name}</Title>
                      <Text type="secondary">{goal.type}</Text>
                      <div style={{ margin: '12px 0 8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text type="secondary">Tiến độ</Text>
                          <Text>{goal.currentValue} / {goal.targetValue}</Text>
                        </div>
                        <Progress percent={percent} size="small" status={goal.status === 'Đã đạt' ? 'success' : goal.status === 'Đã hủy' ? 'exception' : 'active'} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Cập nhật:</Text>
                        <InputNumber size="small" min={0} value={goal.currentValue} onChange={(v) => handleUpdateCurrentValue(goal.id, v || 0)} style={{ width: 80 }} />
                      </div>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                        Deadline: {formatDate(goal.deadline)}
                      </Text>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </TabPane>

        {/* ========== THƯ VIỆN BÀI TẬP ========== */}
        <TabPane tab="Thư viện bài tập" key="exercises">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <Space wrap>
              <Input prefix={<SearchOutlined />} placeholder="Tìm bài tập..." value={exerciseSearch} onChange={(e) => setExerciseSearch(e.target.value)} allowClear style={{ width: 180 }} />
              <Select value={exerciseMuscle} onChange={setExerciseMuscle} style={{ width: 150 }}
                options={[{ value: 'all', label: 'Tất cả nhóm cơ' }, ...['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'].map((v) => ({ value: v, label: v }))]}
              />
              <Select value={exerciseDifficulty} onChange={setExerciseDifficulty} style={{ width: 140 }}
                options={[{ value: 'all', label: 'Tất cả mức độ' }, ...['Dễ', 'Trung bình', 'Khó'].map((v) => ({ value: v, label: v }))]}
              />
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingExercise(null); setIsEditExercise(false); setExerciseModal(true); }}>Thêm bài tập</Button>
          </div>

          {filteredExercises.length === 0 ? <Empty description="Không tìm thấy bài tập" /> : (
            <Row gutter={[16, 16]}>
              {filteredExercises.map((ex) => (
                <Col xs={24} sm={12} lg={8} key={ex.id}>
                  <Card
                    hoverable
                    onClick={() => setDetailExercise(ex)}
                    extra={
                      <Space onClick={(e) => e.stopPropagation()}>
                        <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingExercise(ex); setIsEditExercise(true); setExerciseModal(true); }} />
                        <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDeleteExercise(ex.id)} okText="Xóa" cancelText="Hủy">
                          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    }
                  >
                    <Title level={5} style={{ marginBottom: 8 }}>{ex.name}</Title>
                    <Space style={{ marginBottom: 8 }}>
                      <Tag color="blue">{ex.muscleGroup}</Tag>
                      <Tag color={DIFFICULTY_COLOR[ex.difficulty]}>{ex.difficulty}</Tag>
                    </Space>
                    <br />
                    <Text type="secondary">{ex.description}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>🔥 {ex.caloriesPerHour} calo/giờ</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </TabPane>
      </Tabs>

      {/* Workout Modal */}
      <Modal title={isEditWorkout ? 'Sửa buổi tập' : 'Thêm buổi tập'} visible={workoutModal} footer={null} onCancel={() => { setWorkoutModal(false); setEditingWorkout(null); }} width={500} destroyOnClose>
        <WorkoutForm workout={editingWorkout} isEdit={isEditWorkout} onSubmit={isEditWorkout ? handleEditWorkout : handleAddWorkout} onCancel={() => { setWorkoutModal(false); setEditingWorkout(null); }} />
      </Modal>

      {/* Health Modal */}
      <Modal title={isEditHealth ? 'Sửa chỉ số' : 'Thêm chỉ số sức khỏe'} visible={healthModal} footer={null} onCancel={() => { setHealthModal(false); setEditingHealth(null); }} width={450} destroyOnClose>
        <HealthForm log={editingHealth} isEdit={isEditHealth} onSubmit={isEditHealth ? handleEditHealth : handleAddHealth} onCancel={() => { setHealthModal(false); setEditingHealth(null); }} />
      </Modal>

      {/* Goal Drawer */}
      <GoalForm visible={goalDrawer} goal={editingGoal} isEdit={isEditGoal} onSubmit={isEditGoal ? handleEditGoal : handleAddGoal} onCancel={() => { setGoalDrawer(false); setEditingGoal(null); }} />

      {/* Exercise Modal */}
      <Modal title={isEditExercise ? 'Sửa bài tập' : 'Thêm bài tập'} visible={exerciseModal} footer={null} onCancel={() => { setExerciseModal(false); setEditingExercise(null); }} width={500} destroyOnClose>
        <ExerciseForm exercise={editingExercise} isEdit={isEditExercise} onSubmit={isEditExercise ? handleEditExercise : handleAddExercise} onCancel={() => { setExerciseModal(false); setEditingExercise(null); }} />
      </Modal>

      {/* Exercise Detail Modal */}
      <Modal title={detailExercise?.name} visible={!!detailExercise} footer={<Button onClick={() => setDetailExercise(null)}>Đóng</Button>} onCancel={() => setDetailExercise(null)}>
        {detailExercise && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <Tag color="blue">{detailExercise.muscleGroup}</Tag>
              <Tag color={DIFFICULTY_COLOR[detailExercise.difficulty]}>{detailExercise.difficulty}</Tag>
              <Text type="secondary">🔥 {detailExercise.caloriesPerHour} calo/giờ</Text>
            </Space>
            <p><Text>{detailExercise.description}</Text></p>
            <Title level={5}>Hướng dẫn thực hiện:</Title>
            <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>{detailExercise.instructions}</pre>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HealthTracker;