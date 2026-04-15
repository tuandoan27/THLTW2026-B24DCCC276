import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import type { Room } from '../types';
import { MANAGERS } from '../utils';

interface RoomFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Room | null;
  rooms: Room[]; 
}

const RoomForm: React.FC<RoomFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  rooms,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const codeExists = rooms.some(
        (r) => r.code === values.code && r.id !== initialValues?.id,
      );
      if (codeExists) {
        message.error('Mã phòng đã tồn tại');
        return;
      }

      const nameExists = rooms.some(
        (r) => r.name === values.name && r.id !== initialValues?.id,
      );
      if (nameExists) {
        message.error('Tên phòng đã tồn tại');
        return;
      }

      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa phòng học' : 'Thêm phòng học'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã phòng"
          name="code"
          rules={[
            { required: true, message: 'Vui lòng nhập mã phòng' },
            { max: 10, message: 'Tối đa 10 ký tự' },
          ]}
        >
          <Input placeholder="VD: P101" />
        </Form.Item>
        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên phòng' },
            { max: 50, message: 'Tối đa 50 ký tự' },
          ]}
        >
          <Input placeholder="VD: Phòng máy tính 1" />
        </Form.Item>
        <Form.Item
          label="Số chỗ ngồi"
          name="capacity"
          rules={[
            { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
            { type: 'number', min: 10, max: 200, message: 'Từ 10 đến 200 chỗ' },
          ]}
        >
          <InputNumber min={10} max={200} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Loại phòng"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
        >
          <Select placeholder="Chọn loại phòng">
            <Select.Option value="Lý thuyết">Lý thuyết</Select.Option>
            <Select.Option value="Thực hành">Thực hành</Select.Option>
            <Select.Option value="Hội trường">Hội trường</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Người phụ trách"
          name="manager"
          rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
        >
          <Select placeholder="Chọn người phụ trách">
            {MANAGERS.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomForm;
