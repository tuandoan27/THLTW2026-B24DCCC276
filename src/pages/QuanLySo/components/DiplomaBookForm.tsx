
import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';
import type { DiplomaBook } from '../types';

interface DiplomaBookFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: DiplomaBook | null;
}

const DiplomaBookForm: React.FC<DiplomaBookFormProps> = ({
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
      title={initialValues ? 'Sửa sổ văn bằng' : 'Thêm sổ văn bằng'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Năm"
          name="year"
          rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
        >
          <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Tên sổ"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}
        >
          <Input placeholder="VD: Sổ văn bằng năm 2024" />
        </Form.Item>
        {!initialValues && (
          <Form.Item label="Số hiệu bắt đầu" name="currentNumber" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default DiplomaBookForm;
