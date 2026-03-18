// src/pages/appointment-booking/components/EmployeeForm.tsx

import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, Button, Select, TimePicker, Space, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { Employee, WorkSchedule } from '../types';
import { getDayName } from '../utils';

interface EmployeeFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>([]);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          maxCustomersPerDay: initialValues.maxCustomersPerDay,
        });
        setWorkSchedule(initialValues.workSchedule || []);
      } else {
        form.resetFields();
        setWorkSchedule([]);
      }
    }
  }, [visible, initialValues, form]);

  const handleAddSchedule = () => {
    form.validateFields(['dayOfWeek', 'startTime', 'endTime']).then((values) => {
      setWorkSchedule([
        ...workSchedule,
        {
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime.format('HH:mm'),
          endTime: values.endTime.format('HH:mm'),
        },
      ]);
      form.resetFields(['dayOfWeek', 'startTime', 'endTime']);
    });
  };

  const handleSubmit = () => {
    form.validateFields(['name', 'maxCustomersPerDay']).then((values) => {
      onSubmit({
        ...values,
        workSchedule,
      });
      form.resetFields();
      setWorkSchedule([]);
    });
  };

  const scheduleColumns = [
    {
      title: 'Ngày',
      dataIndex: 'dayOfWeek',
      render: (day: number) => getDayName(day),
    },
    { title: 'Giờ bắt đầu', dataIndex: 'startTime' },
    { title: 'Giờ kết thúc', dataIndex: 'endTime' },
    {
      title: '',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => setWorkSchedule(workSchedule.filter((_, i) => i !== index))}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={initialValues ? 'Sửa nhân viên' : 'Thêm nhân viên'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên nhân viên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số khách tối đa/ngày"
          name="maxCustomersPerDay"
          rules={[{ required: true, message: 'Vui lòng nhập số khách' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <h4>Lịch làm việc:</h4>
        <Space style={{ marginBottom: 16 }}>
          <Form.Item label="Ngày" name="dayOfWeek" style={{ marginBottom: 0 }}>
            <Select style={{ width: 120 }}>
              <Select.Option value={1}>Thứ 2</Select.Option>
              <Select.Option value={2}>Thứ 3</Select.Option>
              <Select.Option value={3}>Thứ 4</Select.Option>
              <Select.Option value={4}>Thứ 5</Select.Option>
              <Select.Option value={5}>Thứ 6</Select.Option>
              <Select.Option value={6}>Thứ 7</Select.Option>
              <Select.Option value={0}>Chủ nhật</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Giờ bắt đầu" name="startTime" style={{ marginBottom: 0 }}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item label="Giờ kết thúc" name="endTime" style={{ marginBottom: 0 }}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Button onClick={handleAddSchedule} style={{ marginTop: 30 }}>
            Thêm
          </Button>
        </Space>

        {workSchedule.length > 0 && (
          <Table
            rowKey={(_, i) => i!}
            dataSource={workSchedule}
            columns={scheduleColumns}
            pagination={false}
            size="small"
          />
        )}
      </Form>
    </Modal>
  );
};

export default EmployeeForm;
