// src/pages/question-bank/components/SubjectForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import type { Subject } from '../types';

interface SubjectFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Subject | null;
}

const SubjectForm: React.FC<SubjectFormProps> = ({
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
      title={initialValues ? 'Sửa môn học' : 'Thêm môn học'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã môn"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}
        >
          <Input placeholder="VD: IT101, MATH202..." />
        </Form.Item>
        <Form.Item
          label="Tên môn"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
        >
          <Input placeholder="VD: Lập trình Web, Toán cao cấp..." />
        </Form.Item>
        <Form.Item
          label="Số tín chỉ"
          name="credits"
          rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectForm;
