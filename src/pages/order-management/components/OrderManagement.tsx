// OrderManagement.tsx - Quản lý đơn hàng

import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Input,
  Select,
  DatePicker,
  Tag,
  Card,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Order, Product, OrderFormValues } from '../types';
import OrderForm from './OrderForm';
import OrderDetailModal from './OrderDetailModal';
import {
  formatCurrency,
  formatDate,
  getOrderStatusColor,
  generateOrderId,
  saveToLocalStorage,
  getFromLocalStorage,
  initialOrders,
} from '../utils';

const { RangePicker } = DatePicker;

interface OrderManagementProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

const STORAGE_KEY = 'orders_data';

const OrderManagement: React.FC<OrderManagementProps> = ({
  products,
  onUpdateProducts,
}) => {
  const [orders, setOrders] = useState<Order[]>(() =>
    getFromLocalStorage(STORAGE_KEY, initialOrders),
  );
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );
  const [dateRange, setDateRange] = useState<any>(null);

  // Lưu vào localStorage khi orders thay đổi
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, orders);
  }, [orders]);

  // Lọc đơn hàng
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Tìm kiếm theo tên khách hàng hoặc mã đơn
      const matchSearch =
        order.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.id.toLowerCase().includes(searchText.toLowerCase());

      // Lọc theo trạng thái
      const matchStatus = selectedStatus
        ? order.status === selectedStatus
        : true;

      // Lọc theo khoảng ngày
      let matchDate = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(dateRange[0].format('YYYY-MM-DD'));
        const endDate = new Date(dateRange[1].format('YYYY-MM-DD'));
        matchDate = orderDate >= startDate && orderDate <= endDate;
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, searchText, selectedStatus, dateRange]);

  // Tạo đơn hàng mới
  const handleCreateOrder = (values: OrderFormValues) => {
    // Tìm thông tin sản phẩm
    const orderProducts = values.products.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || '',
        quantity: item.quantity,
        price: product?.price || 0,
      };
    });

    // Tính tổng tiền
    const totalAmount = orderProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const newOrder: Order = {
      id: generateOrderId(),
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: orderProducts,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    setOrders([newOrder, ...orders]);
    message.success('Tạo đơn hàng thành công');
    setFormVisible(false);
  };

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;

    // Cập nhật trạng thái đơn hàng
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o,
    );
    setOrders(updatedOrders);

    // Xử lý cập nhật số lượng tồn kho
    let updatedProducts = [...products];

    // Nếu chuyển sang "Hoàn thành", trừ tồn kho
    if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
      order.products.forEach((item) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.id === item.productId,
        );
        if (productIndex !== -1) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            quantity: updatedProducts[productIndex].quantity - item.quantity,
          };
        }
      });
      message.success('Đơn hàng đã hoàn thành và trừ tồn kho');
    }

    // Nếu chuyển sang "Đã hủy" từ trạng thái khác, hoàn trả tồn kho
    if (newStatus === 'Đã hủy' && oldStatus === 'Hoàn thành') {
      order.products.forEach((item) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.id === item.productId,
        );
        if (productIndex !== -1) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            quantity: updatedProducts[productIndex].quantity + item.quantity,
          };
        }
      });
      message.success('Đơn hàng đã hủy và hoàn trả tồn kho');
    } else if (newStatus === 'Đã hủy') {
      message.success('Đơn hàng đã hủy');
    } else {
      message.success('Cập nhật trạng thái thành công');
    }

    onUpdateProducts(updatedProducts);
  };

  // Xem chi tiết đơn hàng
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  // Reset bộ lọc
  const handleResetFilters = () => {
    setSearchText('');
    setSelectedStatus(undefined);
    setDateRange(null);
  };

  // Định nghĩa các cột của bảng
  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số sản phẩm',
      key: 'productCount',
      width: 120,
      align: 'center',
      render: (_: any, record: Order) => record.products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      render: (amount: number) => formatCurrency(amount),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 150,
      render: (_: any, record: Order) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: '100%' }}
        >
          <Select.Option value="Chờ xử lý">
            <Tag color={getOrderStatusColor('Chờ xử lý')}>Chờ xử lý</Tag>
          </Select.Option>
          <Select.Option value="Đang giao">
            <Tag color={getOrderStatusColor('Đang giao')}>Đang giao</Tag>
          </Select.Option>
          <Select.Option value="Hoàn thành">
            <Tag color={getOrderStatusColor('Hoàn thành')}>Hoàn thành</Tag>
          </Select.Option>
          <Select.Option value="Đã hủy">
            <Tag color={getOrderStatusColor('Đã hủy')}>Đã hủy</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => formatDate(date),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_: any, record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="Bộ lọc và tìm kiếm" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên KH hoặc mã đơn"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
            >
              <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
              <Select.Option value="Đang giao">Đang giao</Select.Option>
              <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
              <Select.Option value="Đã hủy">Đã hủy</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col>
            <Button onClick={handleResetFilters}>Reset bộ lọc</Button>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setFormVisible(true)}
        >
          Tạo đơn hàng
        </Button>
        <span style={{ marginLeft: 16, color: '#666' }}>
          Tổng số: {filteredOrders.length} đơn hàng
        </span>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredOrders}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
        }}
      />

      <OrderForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleCreateOrder}
        products={products}
      />

      <OrderDetailModal
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;