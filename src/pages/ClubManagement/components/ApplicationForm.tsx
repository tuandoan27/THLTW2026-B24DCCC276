// src/pages/club-management/components/ApplicationForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { Application, Club } from '../types';

interface ApplicationFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Application | null;
  clubs: Club[];
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  clubs,
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
      title={initialValues ? 'Sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select>
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Sở trường"
          name="skills"
          rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
        >
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item
          label="Câu lạc bộ"
          name="clubId"
          rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}
        >
          <Select>
            {clubs
              .filter((c) => c.active)
              .map((club) => (
                <Select.Option key={club.id} value={club.id}>
                  {club.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Lý do đăng ký"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplicationForm;
