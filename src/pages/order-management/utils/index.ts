// src/pages/order-management/utils/index.ts

import type { Product, ProductStatus, Order } from '../types';

/**
 * Xác định trạng thái sản phẩm dựa trên số lượng tồn kho
 */
export const getProductStatus = (quantity: number): ProductStatus => {
  if (quantity === 0) return 'Hết hàng';
  if (quantity <= 10) return 'Sắp hết';
  return 'Còn hàng';
};

/**
 * Lấy màu tag cho trạng thái sản phẩm
 */
export const getProductStatusColor = (status: ProductStatus): string => {
  switch (status) {
    case 'Còn hàng':
      return 'success';
    case 'Sắp hết':
      return 'warning';
    case 'Hết hàng':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Lấy màu tag cho trạng thái đơn hàng
 */
export const getOrderStatusColor = (
  status: Order['status'],
): string => {
  switch (status) {
    case 'Chờ xử lý':
      return 'default';
    case 'Đang giao':
      return 'processing';
    case 'Hoàn thành':
      return 'success';
    case 'Đã hủy':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Format số tiền VNĐ
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + ' VNĐ';
};

/**
 * Format ngày tháng
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

/**
 * Tạo mã đơn hàng ngẫu nhiên
 */
export const generateOrderId = (): string => {
  const prefix = 'DH';
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return prefix + randomNum;
};

/**
 * Validate số điện thoại Việt Nam
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

/**
 * Lưu dữ liệu vào localStorage
 */
export const saveToLocalStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Lấy dữ liệu từ localStorage
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Tính tổng giá trị tồn kho
 */
export const calculateTotalInventoryValue = (products: Product[]): number => {
  return products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
};

/**
 * Dữ liệu sản phẩm mẫu khởi tạo
 */
export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Dell XPS 13',
    category: 'Laptop',
    price: 25000000,
    quantity: 15,
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    category: 'Điện thoại',
    price: 30000000,
    quantity: 8,
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24',
    category: 'Điện thoại',
    price: 22000000,
    quantity: 20,
  },
  {
    id: 4,
    name: 'iPad Air M2',
    category: 'Máy tính bảng',
    price: 18000000,
    quantity: 5,
  },
  {
    id: 5,
    name: 'MacBook Air M3',
    category: 'Laptop',
    price: 28000000,
    quantity: 12,
  },
  {
    id: 6,
    name: 'AirPods Pro 2',
    category: 'Phụ kiện',
    price: 6000000,
    quantity: 0,
  },
  {
    id: 7,
    name: 'Samsung Galaxy Tab S9',
    category: 'Máy tính bảng',
    price: 15000000,
    quantity: 7,
  },
  {
    id: 8,
    name: 'Logitech MX Master 3',
    category: 'Phụ kiện',
    price: 2500000,
    quantity: 25,
  },
];

/**
 * Dữ liệu đơn hàng mẫu khởi tạo
 */
export const initialOrders: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      {
        productId: 1,
        productName: 'Laptop Dell XPS 13',
        quantity: 1,
        price: 25000000,
      },
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];