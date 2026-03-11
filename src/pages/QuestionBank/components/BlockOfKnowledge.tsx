// src/pages/question-bank/components/KnowledgeBlockForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import type { KnowledgeBlock } from '../types';

interface BlockOfKnowledgeProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string }) => void;
  initialValues?: KnowledgeBlock | null;
}

const BlockOfKnowledge: React.FC<BlockOfKnowledgeProps> = ({
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
      title={initialValues ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên khối kiến thức"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="VD: Tổng quan, Chuyên sâu..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlockOfKnowledge;
