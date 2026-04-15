import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Input,
  Select,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { Room, RoomType } from './types';
import RoomForm from './components/RoomForm';
import { saveToLocalStorage, getFromLocalStorage, getRoomTypeColor, MANAGERS } from './utils';

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(() => getFromLocalStorage('rooms', []));
  const [formVisible, setFormVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterType, setFilterType] = useState<RoomType | undefined>();
  const [filterManager, setFilterManager] = useState<string | undefined>();

  useEffect(() => {
    saveToLocalStorage('rooms', rooms);
  }, [rooms]);

  const handleAdd = (values: any) => {
    const newRoom: Room = {
      id: Date.now(),
      ...values,
    };
    setRooms([...rooms, newRoom]);
    message.success('Thêm phòng học thành công');
    setFormVisible(false);
  };

  const handleEdit = (values: any) => {
    if (!editingRoom) return;
    setRooms(rooms.map((r) => (r.id === editingRoom.id ? { ...r, ...values } : r)));
    message.success('Cập nhật phòng học thành công');
    setFormVisible(false);
    setEditingRoom(null);
  };

  const handleDelete = (room: Room) => {
    if (room.capacity >= 30) {
      message.error('Chỉ được xóa phòng dưới 30 chỗ ngồi');
      return;
    }
    setRooms(rooms.filter((r) => r.id !== room.id));
    message.success('Xóa phòng học thành công');
  };

  const filteredRooms = rooms.filter((r) => {
    if (searchCode && !r.code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    if (searchName && !r.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (filterType && r.type !== filterType) return false;
    if (filterManager && r.manager !== filterManager) return false;
    return true;
  });

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 120,
      sorter: (a: Room, b: Room) => a.capacity - b.capacity,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: RoomType) => <Tag color={getRoomTypeColor(type)}>{type}</Tag>,
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'manager',
      key: 'manager',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_: any, record: Room) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRoom(record);
              setFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title={
              record.capacity >= 30
                ? 'Không thể xóa phòng từ 30 chỗ ngồi trở lên'
                : 'Xác nhận xóa phòng này?'
            }
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{
              danger: true,
              disabled: record.capacity >= 30,
            }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.capacity >= 30}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Phòng học</h1>

      <Card
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRoom(null);
              setFormVisible(true);
            }}
          >
            Thêm phòng học
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Tìm theo mã phòng"
            prefix={<SearchOutlined />}
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Input
            placeholder="Tìm theo tên phòng"
            prefix={<SearchOutlined />}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo loại phòng"
            style={{ width: 180 }}
            allowClear
            value={filterType}
            onChange={setFilterType}
          >
            <Select.Option value="Lý thuyết">Lý thuyết</Select.Option>
            <Select.Option value="Thực hành">Thực hành</Select.Option>
            <Select.Option value="Hội trường">Hội trường</Select.Option>
          </Select>
          <Select
            placeholder="Lọc theo người phụ trách"
            style={{ width: 200 }}
            allowClear
            value={filterManager}
            onChange={setFilterManager}
          >
            {MANAGERS.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRooms}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <RoomForm
        visible={formVisible}
        onCancel={() => {
          setFormVisible(false);
          setEditingRoom(null);
        }}
        onSubmit={editingRoom ? handleEdit : handleAdd}
        initialValues={editingRoom}
        rooms={rooms}
      />
    </div>
  );
};

export default RoomManagement;
