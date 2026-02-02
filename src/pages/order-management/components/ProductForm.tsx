// src/pages/order-management/components/ProductForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Modal } from 'antd';
import type { Product, ProductFormValues } from '../types';

interface ProductFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: ProductFormValues) => void;
  initialValues?: Product | null;
  title: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,
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

  const categories = [
    'Laptop',
    'Điện thoại',
    'Máy tính bảng',
    'Phụ kiện',
    'Tai nghe',
    'Bàn phím',
    'Chuột',
  ];

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((cat) => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá (VNĐ)"
          name="price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá' },
            {
              type: 'number',
              min: 1000,
              message: 'Giá phải lớn hơn 1,000 VNĐ',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập giá sản phẩm"
          />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn kho"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            {
              type: 'number',
              min: 0,
              message: 'Số lượng phải lớn hơn hoặc bằng 0',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập số lượng tồn kho"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;