import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
} from 'antd';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const ProductPage: React.FC = () => {
  // ===== Mock data =====
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
  ]);

  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // ===== Add product =====
  const handleAddProduct = (values: any) => {
    const newProduct: Product = {
      id: Date.now(),
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    };

    setProducts([...products, newProduct]);
    message.success('Thêm sản phẩm thành công');
    form.resetFields();
    setVisible(false);
  };

  // ===== Delete product =====
  const handleDelete = (id: number) => {
    setProducts(products.filter((item) => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  // ===== Search =====
  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // ===== Table columns =====
  const columns = [
    {
      title: 'STT',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price: number) => price.toLocaleString() + ' VNĐ',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Product) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý sản phẩm</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setVisible(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredProducts}
        pagination={false}
      />

      <Modal
        title="Thêm sản phẩm mới"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
        okText="Thêm"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải là số dương' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              {
                type: 'number',
                min: 1,
                message: 'Số lượng phải là số nguyên dương',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
