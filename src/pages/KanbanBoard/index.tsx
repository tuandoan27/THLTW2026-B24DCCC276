import {
  Badge, Button, Card, Col, Empty, Input, message, Modal,
  Popconfirm, Row, Select, Space, Table, Tag, Tabs, Typography,
} from 'antd';
import {
  DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task, TaskStatus } from './types';
import TaskForm from './components/TaskForm';
import {
  COLUMN_COLORS, COLUMN_LABELS, formatDate, getFromLocalStorage,
  INITIAL_TASKS, isOverdue, PRIORITY_COLOR, saveToLocalStorage,
} from './utils';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => getFromLocalStorage('kb_tasks', INITIAL_TASKS));
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  // list filters
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  useEffect(() => { saveToLocalStorage('kb_tasks', tasks); }, [tasks]);

  // ===== CRUD =====
  const handleAdd = (values: any) => {
    const newTask: Task = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      ...values,
    };
    setTasks((prev) => [newTask, ...prev]);
    message.success('Thêm task thành công');
    setTaskModal(false);
  };

  const handleEdit = (values: any) => {
    if (!editingTask) return;
    setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...values } : t));
    message.success('Cập nhật thành công');
    setTaskModal(false);
    setEditingTask(null);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    message.success('Đã xóa task');
  };

  // ===== DRAG & DROP =====
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    setTasks((prev) => prev.map((t) => t.id === draggableId ? { ...t, status: newStatus } : t));
  };

  // ===== DASHBOARD =====
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;

  // ===== KANBAN =====
  const columns: TaskStatus[] = ['todo', 'doing', 'done'];

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  // ===== LIST =====
  const filteredTasks = tasks.filter((t) => {
    const matchSearch = !searchText || t.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const listColumns = [
    {
      title: 'Tên task', dataIndex: 'name',
      render: (name: string, record: Task) => (
        <Space direction="vertical" size={0}>
          <Text>{name}</Text>
          {isOverdue(record) && <Text type="danger" style={{ fontSize: 11 }}>⚠ Quá hạn</Text>}
        </Space>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', width: 130,
      render: (s: TaskStatus) => (
        <Tag color={COLUMN_COLORS[s]}>{COLUMN_LABELS[s]}</Tag>
      ),
    },
    {
      title: 'Ưu tiên', dataIndex: 'priority', width: 110,
      render: (p: string) => <Tag color={PRIORITY_COLOR[p]}>{p}</Tag>,
    },
    {
      title: 'Deadline', dataIndex: 'deadline', width: 120,
      render: (d: string) => formatDate(d),
      sorter: (a: Task, b: Task) => a.deadline.localeCompare(b.deadline),
    },
    {
      title: 'Tags', dataIndex: 'tags', width: 160,
      render: (tags: string[]) => tags.map((t) => <Tag key={t}>{t}</Tag>),
    },
    {
      title: 'Thao tác', width: 100,
      render: (_: any, record: Task) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingTask(record); setIsEdit(true); setTaskModal(true); }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Kanban Board</h1>

      <Tabs defaultActiveKey="dashboard">

        {/* ========== DASHBOARD ========== */}
        <TabPane tab="Dashboard" key="dashboard">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', background: '#e6f7ff' }}>
                <Title level={2} style={{ color: '#1890ff', margin: 0 }}>{total}</Title>
                <Text type="secondary">Tổng số task</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', background: '#f6ffed' }}>
                <Title level={2} style={{ color: '#52c41a', margin: 0 }}>{done}</Title>
                <Text type="secondary">Đã hoàn thành</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', background: '#fff1f0' }}>
                <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>{overdue}</Title>
                <Text type="secondary">Quá hạn</Text>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* ========== KANBAN ========== */}
        <TabPane tab="Kanban Board" key="kanban">
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingTask(null); setIsEdit(false); setTaskModal(true); }}>Thêm task</Button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Row gutter={[16, 16]}>
              {columns.map((col) => (
                <Col xs={24} sm={8} key={col}>
                  <Card
                    title={
                      <Space>
                        <span style={{ color: COLUMN_COLORS[col], fontWeight: 'bold' }}>{COLUMN_LABELS[col]}</span>
                        <Badge count={getTasksByStatus(col).length} style={{ backgroundColor: COLUMN_COLORS[col] }} />
                      </Space>
                    }
                    style={{ minHeight: 400, background: '#fafafa' }}
                    bodyStyle={{ padding: 8 }}
                  >
                    <Droppable droppableId={col}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: 300,
                            background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent',
                            borderRadius: 6,
                            padding: 4,
                            transition: 'background 0.2s',
                          }}
                        >
                          {getTasksByStatus(col).length === 0 && (
                            <Empty description="Chưa có task" style={{ marginTop: 40 }} />
                          )}
                          {getTasksByStatus(col).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  style={{
                                    marginBottom: 8,
                                    ...prov.draggableProps.style,
                                  }}
                                >
                                  <Card
                                    size="small"
                                    style={{
                                      boxShadow: snap.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                                      borderLeft: `3px solid ${PRIORITY_COLOR[task.priority] === 'red' ? '#ff4d4f' : PRIORITY_COLOR[task.priority] === 'orange' ? '#fa8c16' : '#52c41a'}`,
                                      cursor: 'grab',
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <Text strong style={{ fontSize: 13 }}>{task.name}</Text>
                                      <Space size={4}>
                                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => { setEditingTask(task); setIsEdit(true); setTaskModal(true); }} />
                                        <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(task.id)} okText="Xóa" cancelText="Hủy">
                                          <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                      </Space>
                                    </div>

                                    {task.description && (
                                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                        {task.description}
                                      </Text>
                                    )}

                                    <div style={{ marginTop: 8 }}>
                                      {task.tags.map((t) => <Tag key={t} style={{ fontSize: 11 }}>{t}</Tag>)}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                                      <Tag color={PRIORITY_COLOR[task.priority]} style={{ fontSize: 11, margin: 0 }}>{task.priority}</Tag>
                                      <Text type={isOverdue(task) ? 'danger' : 'secondary'} style={{ fontSize: 11 }}>
                                        📅 {formatDate(task.deadline)}
                                      </Text>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Card>
                </Col>
              ))}
            </Row>
          </DragDropContext>
        </TabPane>

        {/* ========== DANH SÁCH ========== */}
        <TabPane tab="Danh sách task" key="list">
          <Card extra={
            <Space wrap>
              <Input prefix={<SearchOutlined />} placeholder="Tìm task..." value={searchText} onChange={(e) => setSearchText(e.target.value)} allowClear style={{ width: 200 }} />
              <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 150 }}
                options={[
                  { value: 'all', label: 'Tất cả trạng thái' },
                  { value: 'todo', label: 'Cần làm' },
                  { value: 'doing', label: 'Đang làm' },
                  { value: 'done', label: 'Hoàn thành' },
                ]}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingTask(null); setIsEdit(false); setTaskModal(true); }}>Thêm task</Button>
            </Space>
          }>
            <Table rowKey="id" columns={listColumns} dataSource={filteredTasks} pagination={{ pageSize: 10 }} scroll={{ x: 700 }} />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={isEdit ? 'Sửa task' : 'Thêm task mới'}
        visible={taskModal}
        footer={null}
        onCancel={() => { setTaskModal(false); setEditingTask(null); }}
        width={500}
        destroyOnClose
      >
        <TaskForm
          task={editingTask}
          isEdit={isEdit}
          onSubmit={isEdit ? handleEdit : handleAdd}
          onCancel={() => { setTaskModal(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  );
};

export default KanbanBoard;