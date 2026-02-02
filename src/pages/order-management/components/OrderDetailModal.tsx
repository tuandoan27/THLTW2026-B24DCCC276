// OrderDetailModal.tsx - Modal xem chi tiết đơn hàng

import React from 'react';
import { Modal, Descriptions, Table, Tag } from 'antd';
import { Order } from '../types';
import {
  formatCurrency,
  formatDate,
  getOrderStatusColor,
} from '../utils';

interface OrderDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  order: Order | null;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  visible,
  onCancel,
  order,
}) => {
  if (!order) return null;

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 150,
      render: (_: any, record: any) =>
        formatCurrency(record.price * record.quantity),
    },
  ];

  return (
    <Modal
      title={`Chi tiết đơn hàng ${order.id}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Mã đơn hàng" span={2}>
          <strong>{order.id}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">
          {order.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {order.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ" span={2}>
          {order.address}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDate(order.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={getOrderStatusColor(order.status)}>{order.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <h4>Danh sách sản phẩm</h4>
        <Table
          rowKey="productId"
          columns={columns}
          dataSource={order.products}
          pagination={false}
        />
      </div>

      <div
        style={{
          marginTop: 16,
          textAlign: 'right',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        Tổng tiền:{' '}
        <span style={{ color: '#ff4d4f' }}>
          {formatCurrency(order.totalAmount)}
        </span>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;