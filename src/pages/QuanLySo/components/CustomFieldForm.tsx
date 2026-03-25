
import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { CustomField } from '../types';

interface CustomFieldFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: CustomField | null;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
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
      title={initialValues ? 'Sửa trường thông tin' : 'Thêm trường thông tin'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên trường"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
        >
          <Input placeholder="VD: Dân tộc, Nơi sinh, Điểm TB..." />
        </Form.Item>
        <Form.Item
          label="Kiểu dữ liệu"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn kiểu' }]}
        >
          <Select>
            <Select.Option value="String">Văn bản</Select.Option>
            <Select.Option value="Number">Số</Select.Option>
            <Select.Option value="Date">Ngày</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomFieldForm;
