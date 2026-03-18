import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Select,
  DatePicker,
  Statistic,
  Row,
  Col,
  Rate,
  Input,
  Modal,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import type {
  Employee,
  Service,
  Appointment,
  AppointmentStatus,
  Review,
} from './types';
import EmployeeForm from './components/EmployeeForm';
import ServiceForm from './components/ServiceForm';
import AppointmentForm from './components/AppointmentForm';
import ReviewForm from './components/ReviewForm';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  formatDateTime,
  getStatusColor,
  calculateAverageRating,
  formatCurrency,
  getDayName,
} from './utils';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const AppointmentBooking: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() =>
    getFromLocalStorage('apb_employees', []),
  );
  const [services, setServices] = useState<Service[]>(() =>
    getFromLocalStorage('apb_services', []),
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getFromLocalStorage('apb_appointments', []),
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    getFromLocalStorage('apb_reviews', []),
  );

  const [employeeFormVisible, setEmployeeFormVisible] = useState(false);
  const [serviceFormVisible, setServiceFormVisible] = useState(false);
  const [appointmentFormVisible, setAppointmentFormVisible] = useState(false);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | undefined>();
  const [filterEmployee, setFilterEmployee] = useState<number | undefined>();
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    saveToLocalStorage('apb_employees', employees);
  }, [employees]);

  useEffect(() => {
    saveToLocalStorage('apb_services', services);
  }, [services]);

  useEffect(() => {
    saveToLocalStorage('apb_appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    saveToLocalStorage('apb_reviews', reviews);
  }, [reviews]);

  const handleAddEmployee = (values: any) => {
    setEmployees([...employees, { id: Date.now(), ...values }]);
    message.success('Thêm nhân viên thành công');
    setEmployeeFormVisible(false);
  };

  const handleEditEmployee = (values: any) => {
    if (!editingEmployee) return;
    setEmployees(employees.map((e) => (e.id === editingEmployee.id ? { ...e, ...values } : e)));
    message.success('Cập nhật nhân viên thành công');
    setEmployeeFormVisible(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter((e) => e.id !== id));
    message.success('Xóa nhân viên thành công');
  };

  const handleAddService = (values: any) => {
    setServices([...services, { id: Date.now(), ...values }]);
    message.success('Thêm dịch vụ thành công');
    setServiceFormVisible(false);
  };

  const handleEditService = (values: any) => {
    if (!editingService) return;
    setServices(services.map((s) => (s.id === editingService.id ? { ...s, ...values } : s)));
    message.success('Cập nhật dịch vụ thành công');
    setServiceFormVisible(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
    message.success('Xóa dịch vụ thành công');
  };

  const handleAddAppointment = (values: any) => {
    const newAppointment: Appointment = {
      id: Date.now(),
      ...values,
      status: 'Chờ duyệt' as AppointmentStatus,
      createdAt: new Date().toISOString(),
    };
    setAppointments([newAppointment, ...appointments]);
    message.success('Đặt lịch hẹn thành công');
    setAppointmentFormVisible(false);
  };

  const handleEditAppointment = (values: any) => {
    if (!editingAppointment) return;
    setAppointments(
      appointments.map((a) => (a.id === editingAppointment.id ? { ...a, ...values } : a)),
    );
    message.success('Cập nhật lịch hẹn thành công');
    setAppointmentFormVisible(false);
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    message.success('Xóa lịch hẹn thành công');
  };

  const handleUpdateStatus = (id: number, status: AppointmentStatus) => {
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status } : a)));
    message.success('Cập nhật trạng thái thành công');
  };

  const handleAddReview = (values: any) => {
    if (!selectedAppointment) return;
    const newReview: Review = {
      id: Date.now(),
      appointmentId: selectedAppointment.id,
      employeeId: selectedAppointment.employeeId,
      rating: values.rating,
      comment: values.comment,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);
    message.success('Gửi đánh giá thành công');
    setReviewFormVisible(false);
    setSelectedAppointment(null);
  };

  const handleReply = () => {
    if (!selectedReview || !replyText.trim()) return;
    setReviews(
      reviews.map((r) => (r.id === selectedReview.id ? { ...r, reply: replyText } : r)),
    );
    message.success('Phản hồi đánh giá thành công');
    setReplyModalVisible(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus && a.status !== filterStatus) return false;
    if (filterEmployee && a.employeeId !== filterEmployee) return false;
    if (dateRange && dateRange.length === 2) {
      const start = dateRange[0].format('YYYY-MM-DD');
      const end = dateRange[1].format('YYYY-MM-DD');
      if (a.date < start || a.date > end) return false;
    }
    return true;
  });

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'Hoàn thành').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'Hoàn thành')
    .reduce((sum, a) => {
      const service = services.find((s) => s.id === a.serviceId);
      return sum + (service?.price || 0);
    }, 0);

  const employeeColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name' },
    {
      title: 'Số khách/ngày',
      dataIndex: 'maxCustomersPerDay',
      key: 'maxCustomersPerDay',
    },
    {
      title: 'Lịch làm việc',
      dataIndex: 'workSchedule',
      render: (schedule: any[]) =>
        schedule.map((s, i) => (
          <div key={i}>
            {getDayName(s.dayOfWeek)}: {s.startTime}-{s.endTime}
          </div>
        )),
    },
    {
      title: 'Đánh giá TB',
      key: 'rating',
      render: (_: any, record: Employee) => {
        const avg = calculateAverageRating(reviews, record.id);
        return avg > 0 ? <Rate disabled value={avg} /> : 'Chưa có';
      },
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingEmployee(record);
              setEmployeeFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteEmployee(record.id)}
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

  const serviceColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price: number) => formatCurrency(price),
    },
    { title: 'Thời gian (phút)', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: Service) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingService(record);
              setServiceFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteService(record.id)}
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

  const appointmentColumns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    { title: 'SĐT', dataIndex: 'customerPhone', key: 'customerPhone' },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceId',
      render: (id: number) => services.find((s) => s.id === id)?.name || '---',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeId',
      render: (id: number) => employees.find((e) => e.id === id)?.name || '---',
    },
    {
      title: 'Thời gian',
      key: 'datetime',
      render: (_: any, record: Appointment) => formatDateTime(record.date, record.time),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: AppointmentStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      width: 200,
      render: (_: any, record: Appointment) => (
        <Space direction="vertical" size="small">
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingAppointment(record);
                setAppointmentFormVisible(true);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xác nhận xóa?"
              onConfirm={() => handleDeleteAppointment(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
          {record.status !== 'Hủy' && (
            <Select
              size="small"
              value={record.status}
              onChange={(status) => handleUpdateStatus(record.id, status)}
              style={{ width: 120 }}
            >
              <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
              <Select.Option value="Xác nhận">Xác nhận</Select.Option>
              <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
              <Select.Option value="Hủy">Hủy</Select.Option>
            </Select>
          )}
          {record.status === 'Hoàn thành' &&
            !reviews.find((r) => r.appointmentId === record.id) && (
              <Button
                type="link"
                size="small"
                icon={<StarOutlined />}
                onClick={() => {
                  setSelectedAppointment(record);
                  setReviewFormVisible(true);
                }}
              >
                Đánh giá
              </Button>
            )}
        </Space>
      ),
    },
  ];

  const reviewColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employeeId',
      render: (id: number) => employees.find((e) => e.id === id)?.name || '---',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    { title: 'Nhận xét', dataIndex: 'comment', key: 'comment' },
    {
      title: 'Phản hồi',
      dataIndex: 'reply',
      render: (reply: string) => reply || 'Chưa phản hồi',
    },
    {
      title: 'Thao tác',
      width: 100,
      render: (_: any, record: Review) =>
        !record.reply && (
          <Button
            type="link"
            onClick={() => {
              setSelectedReview(record);
              setReplyModalVisible(true);
            }}
          >
            Phản hồi
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Đặt lịch hẹn</h1>

      <Tabs defaultActiveKey="stats">
        <TabPane tab="Thống kê" key="stats">
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic title="Tổng lịch hẹn" value={totalAppointments} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Hoàn thành" value={completedAppointments} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Doanh thu"
                  value={totalRevenue}
                  suffix="đ"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Nhân viên" key="employee">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingEmployee(null);
                  setEmployeeFormVisible(true);
                }}
              >
                Thêm nhân viên
              </Button>
            }
          >
            <Table
              rowKey="id"
              columns={employeeColumns}
              dataSource={employees}
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Dịch vụ" key="service">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingService(null);
                  setServiceFormVisible(true);
                }}
              >
                Thêm dịch vụ
              </Button>
            }
          >
            <Table rowKey="id" columns={serviceColumns} dataSource={services} pagination={false} />
          </Card>
        </TabPane>

        <TabPane tab="Lịch hẹn" key="appointment">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingAppointment(null);
                  setAppointmentFormVisible(true);
                }}
              >
                Đặt lịch hẹn
              </Button>
            }
          >
            <Space style={{ marginBottom: 16 }}>
              <Select
                placeholder="Trạng thái"
                style={{ width: 120 }}
                allowClear
                value={filterStatus}
                onChange={setFilterStatus}
              >
                <Select.Option value="Chờ duyệt">Chờ duyệt</Select.Option>
                <Select.Option value="Xác nhận">Xác nhận</Select.Option>
                <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                <Select.Option value="Hủy">Hủy</Select.Option>
              </Select>
              <Select
                placeholder="Nhân viên"
                style={{ width: 150 }}
                allowClear
                value={filterEmployee}
                onChange={setFilterEmployee}
              >
                {employees.map((e) => (
                  <Select.Option key={e.id} value={e.id}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
              <RangePicker
                placeholder={['Từ ngày', 'Đến ngày']}
                format="DD/MM/YYYY"
                onChange={setDateRange}
              />
            </Space>
            <Table
              rowKey="id"
              columns={appointmentColumns}
              dataSource={filteredAppointments}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Đánh giá" key="review">
          <Card>
            <Table rowKey="id" columns={reviewColumns} dataSource={reviews} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
      </Tabs>

      <EmployeeForm
        visible={employeeFormVisible}
        onCancel={() => {
          setEmployeeFormVisible(false);
          setEditingEmployee(null);
        }}
        onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
        initialValues={editingEmployee}
      />

      <ServiceForm
        visible={serviceFormVisible}
        onCancel={() => {
          setServiceFormVisible(false);
          setEditingService(null);
        }}
        onSubmit={editingService ? handleEditService : handleAddService}
        initialValues={editingService}
      />

      <AppointmentForm
        visible={appointmentFormVisible}
        onCancel={() => {
          setAppointmentFormVisible(false);
          setEditingAppointment(null);
        }}
        onSubmit={editingAppointment ? handleEditAppointment : handleAddAppointment}
        initialValues={editingAppointment}
        employees={employees}
        services={services}
        appointments={appointments}
      />

      <ReviewForm
        visible={reviewFormVisible}
        onCancel={() => {
          setReviewFormVisible(false);
          setSelectedAppointment(null);
        }}
        onSubmit={handleAddReview}
        appointment={selectedAppointment}
      />

      <Modal
        title="Phản hồi đánh giá"
        visible={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          setSelectedReview(null);
          setReplyText('');
        }}
        onOk={handleReply}
        okText="Gửi"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Nhập phản hồi..."
        />
      </Modal>
    </div>
  );
};

export default AppointmentBooking;
