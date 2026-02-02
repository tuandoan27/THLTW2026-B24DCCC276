// src/pages/order-management/index.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, Card, Row, Col, Statistic, Progress, Badge } from 'antd';
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  DollarOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import type { Product, Order } from './types';
import {
  formatCurrency,
  calculateTotalInventoryValue,
  getFromLocalStorage,
} from './utils';

const { TabPane } = Tabs;

const OrderManagementPage: React.FC = () => {
  // Lấy dữ liệu từ localStorage
  const [products, setProducts] = useState<Product[]>(() =>
    getFromLocalStorage('products_data', []),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    getFromLocalStorage('orders_data', []),
  );

  // Đồng bộ products khi OrderManagement cập nhật
  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  // Lắng nghe thay đổi từ localStorage (khi component con cập nhật)
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedProducts = getFromLocalStorage('products_data', []);
      const updatedOrders = getFromLocalStorage('orders_data', []);
      setProducts(updatedProducts);
      setOrders(updatedOrders);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Tính toán thống kê
  const statistics = useMemo(() => {
    // Tổng số sản phẩm
    const totalProducts = products.length;

    // Tổng giá trị tồn kho
    const totalInventoryValue = calculateTotalInventoryValue(products);

    // Tổng số đơn hàng
    const totalOrders = orders.length;

    // Doanh thu (đơn hàng "Hoàn thành")
    const revenue = orders
      .filter((o) => o.status === 'Hoàn thành')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Số đơn hàng theo trạng thái
    const ordersByStatus = {
      pending: orders.filter((o) => o.status === 'Chờ xử lý').length,
      shipping: orders.filter((o) => o.status === 'Đang giao').length,
      completed: orders.filter((o) => o.status === 'Hoàn thành').length,
      cancelled: orders.filter((o) => o.status === 'Đã hủy').length,
    };

    return {
      totalProducts,
      totalInventoryValue,
      totalOrders,
      revenue,
      ordersByStatus,
    };
  }, [products, orders]);

  // Dashboard component
  const Dashboard = () => (
    <div>
      <h2 style={{ marginBottom: 24 }}>Thống kê tổng quan</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={statistics.totalProducts}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={statistics.totalInventoryValue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={statistics.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={statistics.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Trạng thái đơn hàng">
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span>
                  <Badge color="default" /> Chờ xử lý
                </span>
                <strong>{statistics.ordersByStatus.pending}</strong>
              </div>
              <Progress
                percent={
                  statistics.totalOrders > 0
                    ? (statistics.ordersByStatus.pending /
                        statistics.totalOrders) *
                      100
                    : 0
                }
                strokeColor="#d9d9d9"
                showInfo={false}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span>
                  <Badge color="processing" /> Đang giao
                </span>
                <strong>{statistics.ordersByStatus.shipping}</strong>
              </div>
              <Progress
                percent={
                  statistics.totalOrders > 0
                    ? (statistics.ordersByStatus.shipping /
                        statistics.totalOrders) *
                      100
                    : 0
                }
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span>
                  <Badge color="success" /> Hoàn thành
                </span>
                <strong>{statistics.ordersByStatus.completed}</strong>
              </div>
              <Progress
                percent={
                  statistics.totalOrders > 0
                    ? (statistics.ordersByStatus.completed /
                        statistics.totalOrders) *
                      100
                    : 0
                }
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>

            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span>
                  <Badge color="error" /> Đã hủy
                </span>
                <strong>{statistics.ordersByStatus.cancelled}</strong>
              </div>
              <Progress
                percent={
                  statistics.totalOrders > 0
                    ? (statistics.ordersByStatus.cancelled /
                        statistics.totalOrders) *
                      100
                    : 0
                }
                strokeColor="#ff4d4f"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Phân tích nhanh">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Tỷ lệ hoàn thành"
                  value={
                    statistics.totalOrders > 0
                      ? (
                          (statistics.ordersByStatus.completed /
                            statistics.totalOrders) *
                          100
                        ).toFixed(1)
                      : 0
                  }
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tỷ lệ hủy"
                  value={
                    statistics.totalOrders > 0
                      ? (
                          (statistics.ordersByStatus.cancelled /
                            statistics.totalOrders) *
                          100
                        ).toFixed(1)
                      : 0
                  }
                  suffix="%"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <Statistic
                title="Giá trị trung bình đơn hàng"
                value={
                  statistics.totalOrders > 0
                    ? statistics.revenue / statistics.ordersByStatus.completed
                    : 0
                }
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>
        Hệ thống quản lý đơn hàng và sản phẩm
      </h1>
      <Tabs defaultActiveKey="dashboard">
        <TabPane
          tab={
            <span>
              <DashboardOutlined /> Thống kê
            </span>
          }
          key="dashboard"
        >
          <Dashboard />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShoppingOutlined /> Quản lý sản phẩm
            </span>
          }
          key="products"
        >
          <ProductManagement />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShoppingCartOutlined /> Quản lý đơn hàng
            </span>
          }
          key="orders"
        >
          <OrderManagement
            products={products}
            onUpdateProducts={handleUpdateProducts}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderManagementPage;