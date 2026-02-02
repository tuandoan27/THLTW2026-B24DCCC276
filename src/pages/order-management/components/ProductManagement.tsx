// ProductManagement.tsx - Quản lý sản phẩm nâng cao

import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Select,
  Slider,
  Tag,
  Row,
  Col,
  Card,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Product, ProductFormValues } from '../types';
import ProductForm from './ProductForm';
import {
  getProductStatus,
  getProductStatusColor,
  formatCurrency,
  saveToLocalStorage,
  getFromLocalStorage,
  initialProducts,
} from '../utils';

const STORAGE_KEY = 'products_data';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() =>
    getFromLocalStorage(STORAGE_KEY, initialProducts),
  );
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 50000000,
  ]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');

  // Lưu vào localStorage khi products thay đổi
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, products);
  }, [products]);

  // Lấy danh sách các danh mục duy nhất
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Tìm kiếm theo tên
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      // Lọc theo danh mục
      const matchCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      // Lọc theo trạng thái
      let matchStatus = true;
      if (selectedStatus) {
        const status = getProductStatus(product.quantity);
        matchStatus = status === selectedStatus;
      }

      // Lọc theo khoảng giá
      const matchPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchSearch && matchCategory && matchStatus && matchPrice;
    });

    // Sắp xếp
    switch (sortOrder) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'quantity-asc':
        filtered.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'quantity-desc':
        filtered.sort((a, b) => b.quantity - a.quantity);
        break;
      default:
        break;
    }

    return filtered;
  }, [
    products,
    searchText,
    selectedCategory,
    selectedStatus,
    priceRange,
    sortOrder,
  ]);

  // Thêm sản phẩm
  const handleAddProduct = (values: ProductFormValues) => {
    const newProduct: Product = {
      id: Date.now(),
      ...values,
    };
    setProducts([...products, newProduct]);
    message.success('Thêm sản phẩm thành công');
    setFormVisible(false);
  };

  // Sửa sản phẩm
  const handleEditProduct = (values: ProductFormValues) => {
    if (!editingProduct) return;

    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id ? { ...p, ...values } : p,
    );
    setProducts(updatedProducts);
    message.success('Cập nhật sản phẩm thành công');
    setFormVisible(false);
    setEditingProduct(null);
  };

  // Xóa sản phẩm
  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  // Mở form sửa
  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormVisible(true);
  };

  // Đóng form
  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingProduct(null);
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSearchText('');
    setSelectedCategory(undefined);
    setSelectedStatus(undefined);
    setPriceRange([0, 50000000]);
    setSortOrder('default');
  };

  // Định nghĩa các cột của bảng
  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_: any, record: Product) => {
        const status = getProductStatus(record.quantity);
        const color = getProductStatusColor(status);
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditForm(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="Bộ lọc và tìm kiếm" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn danh mục"
              style={{ width: '100%' }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              allowClear
            >
              {categories.map((cat) => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Select.Option value="Còn hàng">Còn hàng</Select.Option>
              <Select.Option value="Sắp hết">Sắp hết</Select.Option>
              <Select.Option value="Hết hàng">Hết hàng</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Sắp xếp"
              style={{ width: '100%' }}
              value={sortOrder}
              onChange={setSortOrder}
            >
              <Select.Option value="default">Mặc định</Select.Option>
              <Select.Option value="name-asc">Tên A-Z</Select.Option>
              <Select.Option value="name-desc">Tên Z-A</Select.Option>
              <Select.Option value="price-asc">Giá thấp - cao</Select.Option>
              <Select.Option value="price-desc">Giá cao - thấp</Select.Option>
              <Select.Option value="quantity-asc">
                Số lượng tăng dần
              </Select.Option>
              <Select.Option value="quantity-desc">
                Số lượng giảm dần
              </Select.Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col xs={24} md={18}>
            <div>
              <div style={{ marginBottom: 8 }}>
                Khoảng giá: {formatCurrency(priceRange[0])} -{' '}
                {formatCurrency(priceRange[1])}
              </div>
              <Slider
                range
                min={0}
                max={50000000}
                step={1000000}
                value={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>
          </Col>
          <Col xs={24} md={6}>
            <Button onClick={handleResetFilters} block>
              Reset bộ lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            setFormVisible(true);
          }}
        >
          Thêm sản phẩm
        </Button>
        <span style={{ marginLeft: 16, color: '#666' }}>
          Tổng số: {filteredAndSortedProducts.length} sản phẩm
        </span>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredAndSortedProducts}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
      />

      <ProductForm
        visible={formVisible}
        onCancel={handleCloseForm}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        initialValues={editingProduct}
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      />
    </div>
  );
};

export default ProductManagement;