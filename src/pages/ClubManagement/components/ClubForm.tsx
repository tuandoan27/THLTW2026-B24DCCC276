
import React, { useEffect } from 'react';
import { Form, Input, Modal, DatePicker, Switch } from 'antd';
import type { Club } from '../types';

interface ClubFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Club | null;
}

const ClubForm: React.FC<ClubFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          foundedDate: initialValues.foundedDate,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ active: true });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        foundedDate:
          typeof values.foundedDate === 'string'
            ? values.foundedDate
            : values.foundedDate.format('YYYY-MM-DD'),
      };
      onSubmit(formattedValues);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa câu lạc bộ' : 'Thêm câu lạc bộ'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Ảnh đại diện (URL)" name="avatar">
          <Input placeholder="https://example.com/avatar.jpg" />
        </Form.Item>
        <Form.Item
          label="Tên câu lạc bộ"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày thành lập"
          name="foundedDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={4} placeholder="Mô tả về CLB..." />
        </Form.Item>
        <Form.Item
          label="Chủ nhiệm"
          name="leader"
          rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Hoạt động" name="active" valuePropName="checked">
          <Switch checkedChildren="Có" unCheckedChildren="Không" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubForm;
