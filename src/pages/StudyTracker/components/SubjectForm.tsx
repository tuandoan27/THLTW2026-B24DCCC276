
import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import type { Subject } from '../types';

interface SubjectFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string }) => void;
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
          label="Tên môn học"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
        >
          <Input placeholder="VD: Toán, Văn, Anh, Khoa học, Công nghệ..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectForm;