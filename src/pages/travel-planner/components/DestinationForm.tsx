// src/pages/travel-planner/components/DestinationForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, Rate } from 'antd';
import type { Destination } from '../types';

interface DestinationFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Destination | null;
}

const DestinationForm: React.FC<DestinationFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
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
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa điểm đến' : 'Thêm điểm đến'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Hình ảnh (URL)" name="image">
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>
        <Form.Item
          label="Tên điểm đến"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại hình"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
        >
          <Select>
            <Select.Option value="Biển">Biển</Select.Option>
            <Select.Option value="Núi">Núi</Select.Option>
            <Select.Option value="Thành phố">Thành phố</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Thời gian tham quan (giờ)"
          name="visitDuration"
          rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Chi phí ăn uống"
          name="foodCost"
          rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="đ" />
        </Form.Item>
        <Form.Item
          label="Chi phí di chuyển"
          name="transportCost"
          rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="đ" />
        </Form.Item>
        <Form.Item
          label="Chi phí lưu trú"
          name="accommodationCost"
          rules={[{ required: true, message: 'Vui lòng nhập chi phí' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="đ" />
        </Form.Item>
        <Form.Item
          label="Đánh giá"
          name="rating"
          rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
        >
          <Rate />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DestinationForm;
