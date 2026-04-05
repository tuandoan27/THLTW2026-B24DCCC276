
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
  Avatar,
  Modal,
  Input,
  Select,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  TeamOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import type {
  Club,
  Application,
  ApplicationStatus,
  ActionHistory,
  Member,
} from './types';
import ClubForm from './components/ClubForm';
import ApplicationForm from './components/ApplicationForm';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  formatDate,
  formatDateTime,
  getStatusColor,
  getStatusLabel,
} from './utils';

const { TabPane } = Tabs;
const { TextArea } = Input;

const ClubManagement: React.FC = () => {
  // ===== States =====
  const [clubs, setClubs] = useState<Club[]>(() =>
    getFromLocalStorage('cm_clubs', []),
  );
  const [applications, setApplications] = useState<Application[]>(() =>
    getFromLocalStorage('cm_applications', []),
  );
  const [histories, setHistories] = useState<ActionHistory[]>(() =>
    getFromLocalStorage('cm_histories', []),
  );

  // Modal states
  const [clubFormVisible, setClubFormVisible] = useState(false);
  const [applicationFormVisible, setApplicationFormVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [membersModalVisible, setMembersModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<number[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [transferClubId, setTransferClubId] = useState<number | undefined>();

  // Search states
  const [searchText, setSearchText] = useState('');

  // ===== Save to localStorage =====
  useEffect(() => {
    saveToLocalStorage('cm_clubs', clubs);
  }, [clubs]);

  useEffect(() => {
    saveToLocalStorage('cm_applications', applications);
  }, [applications]);

  useEffect(() => {
    saveToLocalStorage('cm_histories', histories);
  }, [histories]);

  // ===== Club Handlers =====
  const handleAddClub = (values: any) => {
    const newClub: Club = {
      id: Date.now(),
      ...values,
    };
    setClubs([...clubs, newClub]);
    message.success('Thêm CLB thành công');
    setClubFormVisible(false);
  };

  const handleEditClub = (values: any) => {
    if (!editingClub) return;
    setClubs(clubs.map((c) => (c.id === editingClub.id ? { ...c, ...values } : c)));
    message.success('Cập nhật CLB thành công');
    setClubFormVisible(false);
    setEditingClub(null);
  };

  const handleDeleteClub = (id: number) => {
    setClubs(clubs.filter((c) => c.id !== id));
    message.success('Xóa CLB thành công');
  };

  // ===== Application Handlers =====
  const handleAddApplication = (values: any) => {
    const newApplication: Application = {
      id: Date.now(),
      ...values,
      status: 'Pending' as ApplicationStatus,
      createdAt: new Date().toISOString(),
    };
    setApplications([...applications, newApplication]);
    message.success('Thêm đơn đăng ký thành công');
    setApplicationFormVisible(false);
  };

  const handleEditApplication = (values: any) => {
    if (!editingApplication) return;
    setApplications(
      applications.map((a) => (a.id === editingApplication.id ? { ...a, ...values } : a)),
    );
    message.success('Cập nhật đơn thành công');
    setApplicationFormVisible(false);
    setEditingApplication(null);
  };

  const handleDeleteApplication = (id: number) => {
    setApplications(applications.filter((a) => a.id !== id));
    message.success('Xóa đơn thành công');
  };

  const handleApprove = (ids: number[]) => {
    setApplications(
      applications.map((a) =>
        ids.includes(a.id) ? { ...a, status: 'Approved' as ApplicationStatus } : a,
      ),
    );

    // Lưu lịch sử
    const newHistories: ActionHistory[] = ids.map((id) => ({
      id: Date.now() + id,
      applicationId: id,
      action: 'Approved',
      timestamp: new Date().toISOString(),
      admin: 'Admin',
    }));
    setHistories([...histories, ...newHistories]);

    message.success(`Đã duyệt ${ids.length} đơn`);
    setSelectedApplicationIds([]);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }

    setApplications(
      applications.map((a) =>
        selectedApplicationIds.includes(a.id)
          ? {
              ...a,
              status: 'Rejected' as ApplicationStatus,
              rejectReason,
            }
          : a,
      ),
    );

    // Lưu lịch sử
    const newHistories: ActionHistory[] = selectedApplicationIds.map((id) => ({
      id: Date.now() + id,
      applicationId: id,
      action: 'Rejected',
      reason: rejectReason,
      timestamp: new Date().toISOString(),
      admin: 'Admin',
    }));
    setHistories([...histories, ...newHistories]);

    message.success(`Đã từ chối ${selectedApplicationIds.length} đơn`);
    setSelectedApplicationIds([]);
    setRejectModalVisible(false);
    setRejectReason('');
  };

  // ===== Member Handlers =====
  const getMembers = (): Member[] => {
    return applications
      .filter((a) => a.status === 'Approved')
      .map((a) => ({
        id: a.id,
        fullName: a.fullName,
        email: a.email,
        phone: a.phone,
        gender: a.gender,
        address: a.address,
        skills: a.skills,
        clubId: a.clubId,
      }));
  };

  const handleTransferClub = () => {
    if (!transferClubId) {
      message.error('Vui lòng chọn CLB');
      return;
    }

    setApplications(
      applications.map((a) =>
        selectedMemberIds.includes(a.id) ? { ...a, clubId: transferClubId } : a,
      ),
    );

    message.success(`Đã chuyển ${selectedMemberIds.length} thành viên`);
    setTransferModalVisible(false);
    setSelectedMemberIds([]);
    setTransferClubId(undefined);
  };

  // ===== Statistics =====
  const stats = {
    totalClubs: clubs.length,
    pending: applications.filter((a) => a.status === 'Pending').length,
    approved: applications.filter((a) => a.status === 'Approved').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  // Statistics by club
  const clubStats = clubs.map((club) => {
    const clubApps = applications.filter((a) => a.clubId === club.id);
    return {
      name: club.name,
      pending: clubApps.filter((a) => a.status === 'Pending').length,
      approved: clubApps.filter((a) => a.status === 'Approved').length,
      rejected: clubApps.filter((a) => a.status === 'Rejected').length,
      total: clubApps.length,
    };
  });

  // ===== Table Columns =====
  const clubColumns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      width: 80,
      render: (avatar: string, record: Club) => (
        <Avatar src={avatar} size={50}>
          {record.name[0]}
        </Avatar>
      ),
    },
    {
      title: 'Tên CLB',
      dataIndex: 'name',
      sorter: (a: Club, b: Club) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      width: 130,
      render: (date: string) => formatDate(date),
      sorter: (a: Club, b: Club) => a.foundedDate.localeCompare(b.foundedDate),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'leader',
      width: 150,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      width: 100,
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>{active ? 'Có' : 'Không'}</Tag>
      ),
      filters: [
        { text: 'Có', value: true },
        { text: 'Không', value: false },
      ],
      onFilter: (value: any, record: Club) => record.active === value,
    },
    {
      title: 'Thao tác',
      width: 200,
      render: (_: any, record: Club) => (
        <Space>
          <Button
            type="link"
            icon={<TeamOutlined />}
            onClick={() => {
              setSelectedClubId(record.id);
              setMembersModalVisible(true);
            }}
          >
            Thành viên
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingClub(record);
              setClubFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteClub(record.id)}
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

  const applicationColumns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      sorter: (a: Application, b: Application) => a.fullName.localeCompare(b.fullName),
    },
    { title: 'Email', dataIndex: 'email', ellipsis: true },
    { title: 'SĐT', dataIndex: 'phone', width: 110 },
    { title: 'Giới tính', dataIndex: 'gender', width: 100 },
    { title: 'Địa chỉ', dataIndex: 'address', ellipsis: true },
    { title: 'Sở trường', dataIndex: 'skills', ellipsis: true },
    {
      title: 'CLB',
      dataIndex: 'clubId',
      width: 150,
      render: (id: number) => clubs.find((c) => c.id === id)?.name || '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 110,
      render: (status: ApplicationStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'Pending' },
        { text: 'Đã duyệt', value: 'Approved' },
        { text: 'Từ chối', value: 'Rejected' },
      ],
      onFilter: (value: any, record: Application) => record.status === value,
    },
    {
      title: 'Thao tác',
      width: 220,
      render: (_: any, record: Application) => (
        <Space size="small" direction="vertical">
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingApplication(record);
                setApplicationFormVisible(true);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xác nhận xóa?"
              onConfirm={() => handleDeleteApplication(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger size="small" icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
          {record.status === 'Pending' && (
            <Space>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove([record.id])}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  setSelectedApplicationIds([record.id]);
                  setRejectModalVisible(true);
                }}
              >
                Từ chối
              </Button>
            </Space>
          )}
        </Space>
      ),
    },
  ];

  const memberColumns = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone', width: 110 },
    { title: 'Giới tính', dataIndex: 'gender', width: 100 },
    { title: 'Địa chỉ', dataIndex: 'address' },
    { title: 'Sở trường', dataIndex: 'skills' },
  ];

  const historyColumns = [
    {
      title: 'Ứng viên',
      dataIndex: 'applicationId',
      render: (id: number) => {
        const app = applications.find((a) => a.id === id);
        return app?.fullName || '---';
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (action: string) => (
        <Tag color={action === 'Approved' ? 'success' : 'error'}>
          {action === 'Approved' ? 'Duyệt' : 'Từ chối'}
        </Tag>
      ),
    },
    { title: 'Lý do', dataIndex: 'reason' },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      render: (time: string) => formatDateTime(time),
    },
    { title: 'Admin', dataIndex: 'admin' },
  ];

  const clubStatsColumns = [
    { title: 'Tên CLB', dataIndex: 'name' },
    { title: 'Chờ duyệt', dataIndex: 'pending' },
    { title: 'Đã duyệt', dataIndex: 'approved' },
    { title: 'Từ chối', dataIndex: 'rejected' },
    { title: 'Tổng', dataIndex: 'total' },
  ];

  // Filtered data
  const filteredClubs = clubs.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const members = selectedClubId
    ? getMembers().filter((m) => m.clubId === selectedClubId)
    : [];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Câu lạc bộ</h1>

      <Tabs defaultActiveKey="stats">
        <TabPane tab="Thống kê" key="stats">
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic title="Số CLB" value={stats.totalClubs} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Chờ duyệt"
                  value={stats.pending}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã duyệt"
                  value={stats.approved}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Từ chối"
                  value={stats.rejected}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Số đơn đăng ký theo CLB">
            <Table
              rowKey="name"
              columns={clubStatsColumns}
              dataSource={clubStats}
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Câu lạc bộ" key="clubs">
          <Card
            extra={
              <Space>
                <Input.Search
                  placeholder="Tìm kiếm CLB..."
                  style={{ width: 200 }}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingClub(null);
                    setClubFormVisible(true);
                  }}
                >
                  Thêm CLB
                </Button>
              </Space>
            }
          >
            <Table
              rowKey="id"
              columns={clubColumns}
              dataSource={filteredClubs}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Đơn đăng ký" key="applications">
          <Card
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingApplication(null);
                    setApplicationFormVisible(true);
                  }}
                >
                  Thêm đơn
                </Button>
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() => setHistoryModalVisible(true)}
                >
                  Lịch sử
                </Button>
              </Space>
            }
          >
            {selectedApplicationIds.length > 0 && (
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(selectedApplicationIds)}
                >
                  Duyệt {selectedApplicationIds.length} đơn
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => setRejectModalVisible(true)}
                >
                  Từ chối {selectedApplicationIds.length} đơn
                </Button>
              </Space>
            )}
            <Table
              rowKey="id"
              columns={applicationColumns}
              dataSource={applications}
              pagination={{ pageSize: 10 }}
              rowSelection={{
                selectedRowKeys: selectedApplicationIds,
                onChange: (keys) => setSelectedApplicationIds(keys as number[]),
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Thành viên" key="members">
          <Card>
            {selectedMemberIds.length > 0 && (
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  onClick={() => setTransferModalVisible(true)}
                >
                  Chuyển {selectedMemberIds.length} thành viên
                </Button>
              </Space>
            )}
            <Table
              rowKey="id"
              columns={[
                ...memberColumns,
                {
                  title: 'CLB',
                  dataIndex: 'clubId',
                  render: (id: number) => clubs.find((c) => c.id === id)?.name || '---',
                },
              ]}
              dataSource={getMembers()}
              pagination={{ pageSize: 10 }}
              rowSelection={{
                selectedRowKeys: selectedMemberIds,
                onChange: (keys) => setSelectedMemberIds(keys as number[]),
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Forms */}
      <ClubForm
        visible={clubFormVisible}
        onCancel={() => {
          setClubFormVisible(false);
          setEditingClub(null);
        }}
        onSubmit={editingClub ? handleEditClub : handleAddClub}
        initialValues={editingClub}
      />

      <ApplicationForm
        visible={applicationFormVisible}
        onCancel={() => {
          setApplicationFormVisible(false);
          setEditingApplication(null);
        }}
        onSubmit={editingApplication ? handleEditApplication : handleAddApplication}
        initialValues={editingApplication}
        clubs={clubs}
      />

      {/* Reject Modal */}
      <Modal
        title="Từ chối đơn đăng ký"
        visible={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
        }}
        onOk={handleReject}
        okText="Từ chối"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>Bạn đang từ chối {selectedApplicationIds.length} đơn đăng ký</p>
        <TextArea
          rows={4}
          placeholder="Nhập lý do từ chối (bắt buộc)"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      {/* Members Modal */}
      <Modal
        title={`Thành viên CLB: ${clubs.find((c) => c.id === selectedClubId)?.name || ''}`}
        visible={membersModalVisible}
        onCancel={() => {
          setMembersModalVisible(false);
          setSelectedClubId(null);
        }}
        footer={null}
        width={900}
      >
        <Table
          rowKey="id"
          columns={memberColumns}
          dataSource={members}
          pagination={false}
        />
      </Modal>

      {/* History Modal */}
      <Modal
        title="Lịch sử thao tác"
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={900}
      >
        <Table
          rowKey="id"
          columns={historyColumns}
          dataSource={histories}
          pagination={{ pageSize: 10 }}
        />
      </Modal>

      {/* Transfer Club Modal */}
      <Modal
        title="Chuyển CLB"
        visible={transferModalVisible}
        onCancel={() => {
          setTransferModalVisible(false);
          setTransferClubId(undefined);
        }}
        onOk={handleTransferClub}
        okText="Chuyển"
        cancelText="Hủy"
      >
        <p>Chuyển {selectedMemberIds.length} thành viên sang CLB:</p>
        <Select
          style={{ width: '100%' }}
          placeholder="Chọn CLB"
          value={transferClubId}
          onChange={setTransferClubId}
        >
          {clubs
            .filter((c) => c.active)
            .map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ClubManagement;
