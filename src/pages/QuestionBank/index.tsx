// src/pages/question-bank/index.tsx

import React, { useState, useEffect } from 'react';
import { Tabs, Card, Table, Button, Space, Popconfirm, message, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type {
  KnowledgeBlock,
  Subject,
  Question,
  Difficulty,
  ExamStructure,
  ExamStructureItem,
  Exam,
} from './types';
import BlockOfKnowledge from './components/BlockOfKnowledge';
import SubjectForm from './components/SubjectForm';
import QuestionForm from './components/QuestionForm';
import ExamStructureForm from './components/ExamStructureForm';
import CreateExamForm from './components/CreateExamForm';
import { saveToLocalStorage, getFromLocalStorage, getDifficultyColor, formatDate } from './utils';

const { TabPane } = Tabs;

const QuestionBank: React.FC = () => {
  // ===== States =====
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>(() =>
    getFromLocalStorage('kb_knowledge_blocks', []),
  );
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    getFromLocalStorage('kb_subjects', []),
  );
  const [questions, setQuestions] = useState<Question[]>(() =>
    getFromLocalStorage('kb_questions', []),
  );
  const [examStructures, setExamStructures] = useState<ExamStructure[]>(() =>
    getFromLocalStorage('kb_exam_structures', []),
  );
  const [exams, setExams] = useState<Exam[]>(() =>
    getFromLocalStorage('kb_exams', []),
  );

  // Modal states
  const [kbFormVisible, setKbFormVisible] = useState(false);
  const [subjectFormVisible, setSubjectFormVisible] = useState(false);
  const [questionFormVisible, setQuestionFormVisible] = useState(false);
  const [structureFormVisible, setStructureFormVisible] = useState(false);
  const [examFormVisible, setExamFormVisible] = useState(false);

  const [editingKB, setEditingKB] = useState<KnowledgeBlock | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Filter states
  const [filterSubject, setFilterSubject] = useState<number | undefined>();
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | undefined>();
  const [filterKB, setFilterKB] = useState<number | undefined>();

  // ===== Save to localStorage =====
  useEffect(() => {
    saveToLocalStorage('kb_knowledge_blocks', knowledgeBlocks);
  }, [knowledgeBlocks]);

  useEffect(() => {
    saveToLocalStorage('kb_subjects', subjects);
  }, [subjects]);

  useEffect(() => {
    saveToLocalStorage('kb_questions', questions);
  }, [questions]);

  useEffect(() => {
    saveToLocalStorage('kb_exam_structures', examStructures);
  }, [examStructures]);

  useEffect(() => {
    saveToLocalStorage('kb_exams', exams);
  }, [exams]);

  // ===== Knowledge Block Handlers =====
  const handleAddKB = (values: { name: string }) => {
    setKnowledgeBlocks([...knowledgeBlocks, { id: Date.now(), ...values }]);
    message.success('Thêm khối kiến thức thành công');
    setKbFormVisible(false);
  };

  const handleEditKB = (values: { name: string }) => {
    if (!editingKB) return;
    setKnowledgeBlocks(
      knowledgeBlocks.map((kb) => (kb.id === editingKB.id ? { ...kb, ...values } : kb)),
    );
    message.success('Cập nhật khối kiến thức thành công');
    setKbFormVisible(false);
    setEditingKB(null);
  };

  const handleDeleteKB = (id: number) => {
    setKnowledgeBlocks(knowledgeBlocks.filter((kb) => kb.id !== id));
    message.success('Xóa khối kiến thức thành công');
  };

  // ===== Subject Handlers =====
  const handleAddSubject = (values: any) => {
    setSubjects([...subjects, { id: Date.now(), ...values }]);
    message.success('Thêm môn học thành công');
    setSubjectFormVisible(false);
  };

  const handleEditSubject = (values: any) => {
    if (!editingSubject) return;
    setSubjects(subjects.map((s) => (s.id === editingSubject.id ? { ...s, ...values } : s)));
    message.success('Cập nhật môn học thành công');
    setSubjectFormVisible(false);
    setEditingSubject(null);
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    message.success('Xóa môn học thành công');
  };

  // ===== Question Handlers =====
  const handleAddQuestion = (values: any) => {
    setQuestions([...questions, { id: Date.now(), ...values }]);
    message.success('Thêm câu hỏi thành công');
    setQuestionFormVisible(false);
  };

  const handleEditQuestion = (values: any) => {
    if (!editingQuestion) return;
    setQuestions(questions.map((q) => (q.id === editingQuestion.id ? { ...q, ...values } : q)));
    message.success('Cập nhật câu hỏi thành công');
    setQuestionFormVisible(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
    message.success('Xóa câu hỏi thành công');
  };

  // ===== Exam Structure Handlers =====
  const handleSaveStructure = (values: any, items: ExamStructureItem[]) => {
    const newStructure: ExamStructure = {
      id: Date.now(),
      name: values.name,
      subjectId: values.subjectId,
      items,
    };
    setExamStructures([...examStructures, newStructure]);
    message.success('Lưu cấu trúc đề thi thành công');
    setStructureFormVisible(false);
  };

  const handleDeleteStructure = (id: number) => {
    setExamStructures(examStructures.filter((s) => s.id !== id));
    message.success('Xóa cấu trúc đề thi thành công');
  };

  // ===== Exam Handlers =====
  const handleCreateExam = (values: any) => {
    const structure = examStructures.find((s) => s.id === values.structureId);
    if (!structure) return;

    const selectedQuestions: Question[] = [];
    let error = false;

    structure.items.forEach((item) => {
      const availableQuestions = questions.filter(
        (q) =>
          q.subjectId === structure.subjectId &&
          q.difficulty === item.difficulty &&
          q.knowledgeBlockId === item.knowledgeBlockId &&
          !selectedQuestions.includes(q),
      );

      if (availableQuestions.length < item.quantity) {
        message.error(
          `Không đủ câu hỏi ${item.difficulty} - Khối ${
            knowledgeBlocks.find((kb) => kb.id === item.knowledgeBlockId)?.name ||
            item.knowledgeBlockId
          }`,
        );
        error = true;
        return;
      }

      const shuffled = [...availableQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, item.quantity));
    });

    if (error) return;

    const newExam: Exam = {
      id: Date.now(),
      name: values.name,
      subjectId: structure.subjectId,
      structureId: values.structureId,
      questions: selectedQuestions,
      createdAt: new Date().toISOString(),
    };

    setExams([newExam, ...exams]);
    message.success('Tạo đề thi thành công');
    setExamFormVisible(false);
  };

  const handleDeleteExam = (id: number) => {
    setExams(exams.filter((e) => e.id !== id));
    message.success('Xóa đề thi thành công');
  };

  // ===== Filtered Questions =====
  const filteredQuestions = questions.filter((q) => {
    if (filterSubject && q.subjectId !== filterSubject) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    if (filterKB && q.knowledgeBlockId !== filterKB) return false;
    return true;
  });

  // ===== Table Columns =====
  const kbColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên khối kiến thức', dataIndex: 'name', key: 'name' },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: KnowledgeBlock) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingKB(record);
              setKbFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteKB(record.id)}
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

  const subjectColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Mã môn', dataIndex: 'code', key: 'code' },
    { title: 'Tên môn', dataIndex: 'name', key: 'name' },
    { title: 'Số tín chỉ', dataIndex: 'credits', key: 'credits' },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: Subject) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSubject(record);
              setSubjectFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
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

  const questionColumns = [
    { title: 'Mã CH', dataIndex: 'code', key: 'code', width: 100 },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      render: (id: number) => subjects.find((s) => s.id === id)?.name || '---',
    },
    { title: 'Nội dung', dataIndex: 'content', key: 'content' },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      render: (d: Difficulty) => <Tag color={getDifficultyColor(d)}>{d}</Tag>,
    },
    {
      title: 'Khối KT',
      dataIndex: 'knowledgeBlockId',
      render: (id: number) => knowledgeBlocks.find((kb) => kb.id === id)?.name || '---',
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: Question) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingQuestion(record);
              setQuestionFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteQuestion(record.id)}
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

  const structureColumns = [
    { title: 'Tên cấu trúc', dataIndex: 'name', key: 'name' },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      render: (id: number) => subjects.find((s) => s.id === id)?.name || '---',
    },
    {
      title: 'Số yêu cầu',
      dataIndex: 'items',
      render: (items: ExamStructureItem[]) => items.length,
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_: any, record: ExamStructure) => (
        <Popconfirm
          title="Xác nhận xóa?"
          onConfirm={() => handleDeleteStructure(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const examColumns = [
    { title: 'Tên đề thi', dataIndex: 'name', key: 'name' },
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      render: (id: number) => subjects.find((s) => s.id === id)?.name || '---',
    },
    {
      title: 'Số câu',
      dataIndex: 'questions',
      render: (qs: Question[]) => qs.length,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_: any, record: Exam) => (
        <Popconfirm
          title="Xác nhận xóa?"
          onConfirm={() => handleDeleteExam(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Ngân hàng Câu hỏi</h1>

      <Tabs defaultActiveKey="kb">
        <TabPane tab="Khối kiến thức" key="kb">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingKB(null);
                  setKbFormVisible(true);
                }}
              >
                Thêm
              </Button>
            }
          >
            <Table rowKey="id" columns={kbColumns} dataSource={knowledgeBlocks} pagination={false} />
          </Card>
        </TabPane>

        <TabPane tab="Môn học" key="subject">
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
                Thêm
              </Button>
            }
          >
            <Table rowKey="id" columns={subjectColumns} dataSource={subjects} pagination={false} />
          </Card>
        </TabPane>

        <TabPane tab="Câu hỏi" key="question">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionFormVisible(true);
                }}
              >
                Thêm
              </Button>
            }
          >
            <Space style={{ marginBottom: 16 }}>
              <Select
                placeholder="Môn học"
                style={{ width: 150 }}
                allowClear
                value={filterSubject}
                onChange={setFilterSubject}
              >
                {subjects.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Độ khó"
                style={{ width: 120 }}
                allowClear
                value={filterDifficulty}
                onChange={setFilterDifficulty}
              >
                <Select.Option value="Dễ">Dễ</Select.Option>
                <Select.Option value="Trung bình">Trung bình</Select.Option>
                <Select.Option value="Khó">Khó</Select.Option>
                <Select.Option value="Rất khó">Rất khó</Select.Option>
              </Select>
              <Select
                placeholder="Khối KT"
                style={{ width: 150 }}
                allowClear
                value={filterKB}
                onChange={setFilterKB}
              >
                {knowledgeBlocks.map((kb) => (
                  <Select.Option key={kb.id} value={kb.id}>
                    {kb.name}
                  </Select.Option>
                ))}
              </Select>
            </Space>
            <Table
              rowKey="id"
              columns={questionColumns}
              dataSource={filteredQuestions}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Cấu trúc đề thi" key="structure">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setStructureFormVisible(true)}
              >
                Thêm cấu trúc
              </Button>
            }
          >
            <Table rowKey="id" columns={structureColumns} dataSource={examStructures} pagination={false} />
          </Card>
        </TabPane>

        <TabPane tab="Đề thi" key="exam">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setExamFormVisible(true)}
              >
                Tạo đề thi
              </Button>
            }
          >
            <Table rowKey="id" columns={examColumns} dataSource={exams} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
      </Tabs>

      {/* Forms */}
      <BlockOfKnowledge
        visible={kbFormVisible}
        onCancel={() => {
          setKbFormVisible(false);
          setEditingKB(null);
        }}
        onSubmit={editingKB ? handleEditKB : handleAddKB}
        initialValues={editingKB}
      />

      <SubjectForm
        visible={subjectFormVisible}
        onCancel={() => {
          setSubjectFormVisible(false);
          setEditingSubject(null);
        }}
        onSubmit={editingSubject ? handleEditSubject : handleAddSubject}
        initialValues={editingSubject}
      />

      <QuestionForm
        visible={questionFormVisible}
        onCancel={() => {
          setQuestionFormVisible(false);
          setEditingQuestion(null);
        }}
        onSubmit={editingQuestion ? handleEditQuestion : handleAddQuestion}
        initialValues={editingQuestion}
        subjects={subjects}
        knowledgeBlocks={knowledgeBlocks}
      />

      <ExamStructureForm
        visible={structureFormVisible}
        onCancel={() => setStructureFormVisible(false)}
        onSubmit={handleSaveStructure}
        subjects={subjects}
        knowledgeBlocks={knowledgeBlocks}
      />

      <CreateExamForm
        visible={examFormVisible}
        onCancel={() => setExamFormVisible(false)}
        onSubmit={handleCreateExam}
        examStructures={examStructures}
        subjects={subjects}
      />
    </div>
  );
};

export default QuestionBank;
