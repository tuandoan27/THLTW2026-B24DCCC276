
import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Subject, StudySession, MonthlyGoal } from './types';
import SubjectForm from './components/SubjectForm';
import SessionForm from './components/SessionForm';
import GoalForm from './components/GoalForm';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  calculateMonthlyStudyTime,
  minutesToHours,
  formatDate,
  formatMonth,
  getCurrentMonth,
} from './utils';

const { TabPane } = Tabs;

const StudyTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getFromLocalStorage('study_subjects', []),
  );
  const [sessions, setSessions] = useState<StudySession[]>(() =>
    getFromLocalStorage('study_sessions', []),
  );
  const [goals, setGoals] = useState<MonthlyGoal[]>(() =>
    getFromLocalStorage('study_goals', []),
  );

  const [subjectFormVisible, setSubjectFormVisible] = useState(false);
  const [sessionFormVisible, setSessionFormVisible] = useState(false);
  const [goalFormVisible, setGoalFormVisible] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);

  useEffect(() => {
    saveToLocalStorage('study_subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    saveToLocalStorage('study_sessions', sessions);
  }, [sessions]);

  useEffect(() => {
    saveToLocalStorage('study_goals', goals);
  }, [goals]);

  const handleAddSubject = (values: { name: string }) => {
    const newSubject: Subject = {
      id: Date.now(),
      name: values.name,
    };
    setSubjects([...subjects, newSubject]);
    message.success('Thêm môn học thành công');
    setSubjectFormVisible(false);
  };

  const handleEditSubject = (values: { name: string }) => {
    if (!editingSubject) return;
    const updatedSubjects = subjects.map((s) =>
      s.id === editingSubject.id ? { ...s, ...values } : s,
    );
    setSubjects(updatedSubjects);
    message.success('Cập nhật môn học thành công');
    setSubjectFormVisible(false);
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    message.success('Xóa môn học thành công');
  };

  const openEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectFormVisible(true);
  };

  const handleAddSession = (values: any) => {
    const subject = subjects.find((s) => s.id === values.subjectId);
    const newSession: StudySession = {
      id: Date.now(),
      ...values,
      subjectName: subject?.name || '',
    };
    setSessions([newSession, ...sessions]);
    message.success('Thêm lịch học thành công');
    setSessionFormVisible(false);
  };

  const handleEditSession = (values: any) => {
    if (!editingSession) return;
    const subject = subjects.find((s) => s.id === values.subjectId);
    const updatedSessions = sessions.map((s) =>
      s.id === editingSession.id
        ? { ...s, ...values, subjectName: subject?.name || '' }
        : s,
    );
    setSessions(updatedSessions);
    message.success('Cập nhật lịch học thành công');
    setSessionFormVisible(false);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
    message.success('Xóa lịch học thành công');
  };

  const openEditSession = (session: StudySession) => {
    setEditingSession(session);
    setSessionFormVisible(true);
  };

  const handleAddGoal = (values: any) => {
    const newGoal: MonthlyGoal = {
      id: Date.now(),
      ...values,
    };
    setGoals([...goals, newGoal]);
    message.success('Thêm mục tiêu thành công');
    setGoalFormVisible(false);
  };

  const handleEditGoal = (values: any) => {
    if (!editingGoal) return;
    const updatedGoals = goals.map((g) =>
      g.id === editingGoal.id ? { ...g, ...values } : g,
    );
    setGoals(updatedGoals);
    message.success('Cập nhật mục tiêu thành công');
    setGoalFormVisible(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter((g) => g.id !== id));
    message.success('Xóa mục tiêu thành công');
  };

  const openEditGoal = (goal: MonthlyGoal) => {
    setEditingGoal(goal);
    setGoalFormVisible(true);
  };

  const subjectColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Subject) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditSubject(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteSubject(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const sessionColumns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Ngày học',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Giờ bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Nội dung đã học',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: StudySession) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditSession(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteSession(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const goalColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render: (month: string) => `Tháng ${formatMonth(month)}`,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: number | null) => {
        if (!subjectId) return 'Tổng thể';
        const subject = subjects.find((s) => s.id === subjectId);
        return subject?.name || '---';
      },
    },
    {
      title: 'Mục tiêu (giờ)',
      dataIndex: 'targetHours',
      key: 'targetHours',
    },
    {
      title: 'Đã học (giờ)',
      key: 'actual',
      render: (_: any, record: MonthlyGoal) => {
        const minutes = calculateMonthlyStudyTime(
          sessions,
          record.month,
          record.subjectId || undefined,
        );
        return minutesToHours(minutes);
      },
    },
    {
      title: 'Tiến độ',
      key: 'progress',
      render: (_: any, record: MonthlyGoal) => {
        const minutes = calculateMonthlyStudyTime(
          sessions,
          record.month,
          record.subjectId || undefined,
        );
        const hours = minutesToHours(minutes);
        const percent = Math.min(
          Math.round((hours / record.targetHours) * 100),
          100,
        );
        return <Progress percent={percent} />;
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: MonthlyGoal) => {
        const minutes = calculateMonthlyStudyTime(
          sessions,
          record.month,
          record.subjectId || undefined,
        );
        const hours = minutesToHours(minutes);
        const achieved = hours >= record.targetHours;
        return achieved ? (
          <Tag color="success">Đã đạt</Tag>
        ) : (
          <Tag color="warning">Chưa đạt</Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: MonthlyGoal) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditGoal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDeleteGoal(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Tiến độ Học tập</h1>

      <Tabs defaultActiveKey="subjects">
        <TabPane tab="Danh mục môn học" key="subjects">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSubject(null);
                  setSubjectFormVisible(true);
                }}
              >
                Thêm môn học
              </Button>
            }
          >
            <Table
              rowKey="id"
              columns={subjectColumns}
              dataSource={subjects}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Lịch học" key="sessions">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSession(null);
                  setSessionFormVisible(true);
                }}
              >
                Thêm lịch học
              </Button>
            }
          >
            <Table
              rowKey="id"
              columns={sessionColumns}
              dataSource={sessions}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Mục tiêu hàng tháng" key="goals">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingGoal(null);
                  setGoalFormVisible(true);
                }}
              >
                Thêm mục tiêu
              </Button>
            }
          >
            <Table
              rowKey="id"
              columns={goalColumns}
              dataSource={goals}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Forms */}
      <SubjectForm
        visible={subjectFormVisible}
        onCancel={() => {
          setSubjectFormVisible(false);
          setEditingSubject(null);
        }}
        onSubmit={editingSubject ? handleEditSubject : handleAddSubject}
        initialValues={editingSubject}
      />

      <SessionForm
        visible={sessionFormVisible}
        onCancel={() => {
          setSessionFormVisible(false);
          setEditingSession(null);
        }}
        onSubmit={editingSession ? handleEditSession : handleAddSession}
        initialValues={editingSession}
        subjects={subjects}
      />

      <GoalForm
        visible={goalFormVisible}
        onCancel={() => {
          setGoalFormVisible(false);
          setEditingGoal(null);
        }}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        initialValues={editingGoal}
        subjects={subjects}
      />
    </div>
  );
};

export default StudyTracker;
