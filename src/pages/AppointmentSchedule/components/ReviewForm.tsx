import React, { useEffect } from 'react';
import { Form, Input, Modal, Rate } from 'antd';
import type { Appointment } from '../types';

interface ReviewFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  appointment: Appointment | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  appointment,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Đánh giá dịch vụ"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Gửi đánh giá"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Đánh giá"
          name="rating"
          rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
        >
          <Rate />
        </Form.Item>
        <Form.Item
          label="Nhận xét"
          name="comment"
          rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewForm;
