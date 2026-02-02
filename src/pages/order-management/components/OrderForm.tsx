// OrderForm.tsx - Form tạo đơn hàng mới

import React, { useState, useMemo } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Modal,
  Space,
  Button,
  Table,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Product, OrderFormValues } from '../types';
import { formatCurrency, validatePhoneNumber } from '../utils';

interface OrderFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: OrderFormValues) => void;
  products: Product[];
}

interface SelectedProduct {
  productId: number;
  productName: string;
  price: number;
  maxQuantity: number;
  quantity: number;
}

const OrderForm: React.FC<OrderFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  products,
}) => {
  const [form] = Form.useForm();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );

  // Lọc sản phẩm còn hàng
  const availableProducts = useMemo(() => {
    return products.filter((p) => p.quantity > 0);
  }, [products]);

  // Tính tổng tiền
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [selectedProducts]);

  // Thêm sản phẩm vào đơn
  const handleAddProduct = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Kiểm tra sản phẩm đã được chọn chưa
    const exists = selectedProducts.find((p) => p.productId === productId);
    if (exists) {
      message.warning('Sản phẩm này đã được thêm vào đơn hàng');
      return;
    }

    const newProduct: SelectedProduct = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      maxQuantity: product.quantity,
      quantity: 1,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
  };

  // Xóa sản phẩm khỏi đơn
  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.productId !== productId));
  };

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.productId === productId ? { ...p, quantity } : p,
      ),
    );
  };

  // Submit form
  const handleSubmit = () => {
    if (selectedProducts.length === 0) {
      message.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    form.validateFields().then((values) => {
      const orderData: OrderFormValues = {
        customerName: values.customerName,
        phone: values.phone,
        address: values.address,
        products: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      };

      onSubmit(orderData);
      handleReset();
    });
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    setSelectedProducts([]);
  };

  // Đóng modal
  const handleClose = () => {
    handleReset();
    onCancel();
  };

  // Cột bảng sản phẩm đã chọn
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 150,
      render: (_: any, record: SelectedProduct) => (
        <InputNumber
          min={1}
          max={record.maxQuantity}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.productId, value || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_: any, record: SelectedProduct) =>
        formatCurrency(record.price * record.quantity),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: SelectedProduct) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveProduct(record.productId)}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Tạo đơn hàng mới"
      visible={visible}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Tạo đơn hàng"
      cancelText="Hủy"
      width={900}
    >
      <Form form={form} layout="vertical">
        <div style={{ marginBottom: 24 }}>
          <h4>Thông tin khách hàng</h4>
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khách hàng' },
              { min: 2, message: 'Tên phải có ít nhất 2 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              {
                validator: (_, value) => {
                  if (!value || validatePhoneNumber(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Số điện thoại không hợp lệ (10-11 số)'),
                  );
                },
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại (VD: 0912345678)" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ' },
              { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' },
            ]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập địa chỉ giao hàng"
            />
          </Form.Item>
        </div>

        <div>
          <h4>Chọn sản phẩm</h4>
          <Space style={{ marginBottom: 16, width: '100%' }}>
            <Select
              showSearch
              placeholder="Chọn sản phẩm để thêm vào đơn"
              style={{ width: 400 }}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={availableProducts.map((p) => ({
                value: p.id,
                label: `${p.name} - ${formatCurrency(p.price)} (Còn ${p.quantity})`,
              }))}
              onChange={handleAddProduct}
              value={undefined}
            />
          </Space>

          <Table
            rowKey="productId"
            columns={columns}
            dataSource={selectedProducts}
            pagination={false}
            locale={{ emptyText: 'Chưa có sản phẩm nào được chọn' }}
          />

          <div
            style={{
              marginTop: 16,
              textAlign: 'right',
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            Tổng tiền: <span style={{ color: '#ff4d4f' }}>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default OrderForm;