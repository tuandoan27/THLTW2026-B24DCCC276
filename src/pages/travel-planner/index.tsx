// src/pages/travel-planner/index.tsx

import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Card,
  Row,
  Col,
  Rate,
  Tag,
  Button,
  Select,
  Slider,
  Table,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Statistic,
  Alert,
  List,
  Avatar,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import type { Destination, Itinerary, ItineraryItem, BudgetItem, LocationType } from './types';
import DestinationForm from './components/DestinationForm';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  formatCurrency,
  getLocationTypeColor,
  formatDate,
} from './utils';

const { TabPane } = Tabs;
const { Option } = Select;

const TravelPlanner: React.FC = () => {
  // ===== States =====
  const [destinations, setDestinations] = useState<Destination[]>(() =>
    getFromLocalStorage('tp_destinations', []),
  );
  const [itineraries, setItineraries] = useState<Itinerary[]>(() =>
    getFromLocalStorage('tp_itineraries', []),
  );
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryItem[]>([]);
  const [currentBudget, setCurrentBudget] = useState(0);

  // Filter states
  const [filterType, setFilterType] = useState<LocationType | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minRating, setMinRating] = useState(0);

  // Modal states
  const [destFormVisible, setDestFormVisible] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [saveItineraryVisible, setSaveItineraryVisible] = useState(false);
  const [itineraryName, setItineraryName] = useState('');

  // ===== Save to localStorage =====
  useEffect(() => {
    saveToLocalStorage('tp_destinations', destinations);
  }, [destinations]);

  useEffect(() => {
    saveToLocalStorage('tp_itineraries', itineraries);
  }, [itineraries]);

  // ===== Destination Handlers =====
  const handleAddDestination = (values: any) => {
    const newDest: Destination = {
      id: Date.now(),
      ...values,
    };
    setDestinations([...destinations, newDest]);
    message.success('Thêm điểm đến thành công');
    setDestFormVisible(false);
  };

  const handleEditDestination = (values: any) => {
    if (!editingDest) return;
    setDestinations(destinations.map((d) => (d.id === editingDest.id ? { ...d, ...values } : d)));
    message.success('Cập nhật điểm đến thành công');
    setDestFormVisible(false);
    setEditingDest(null);
  };

  const handleDeleteDestination = (id: number) => {
    setDestinations(destinations.filter((d) => d.id !== id));
    message.success('Xóa điểm đến thành công');
  };

  // ===== Itinerary Handlers =====
  const addToItinerary = (destinationId: number) => {
    const maxDay = currentItinerary.length > 0 ? Math.max(...currentItinerary.map((i) => i.day)) : 0;
    const dayItems = currentItinerary.filter((i) => i.day === maxDay || maxDay === 0);
    const newItem: ItineraryItem = {
      id: Date.now(),
      destinationId,
      day: maxDay === 0 ? 1 : maxDay,
      order: dayItems.length + 1,
    };
    setCurrentItinerary([...currentItinerary, newItem]);
    message.success('Đã thêm vào lịch trình');
  };

  const removeFromItinerary = (id: number) => {
    setCurrentItinerary(currentItinerary.filter((i) => i.id !== id));
  };

  const saveItinerary = () => {
    if (!itineraryName.trim()) {
      message.error('Vui lòng nhập tên lịch trình');
      return;
    }

    const totalBudget = calculateTotalBudget();
    const newItinerary: Itinerary = {
      id: Date.now(),
      name: itineraryName,
      items: currentItinerary,
      totalBudget,
      createdAt: new Date().toISOString(),
    };

    setItineraries([...itineraries, newItinerary]);
    message.success('Lưu lịch trình thành công');
    setSaveItineraryVisible(false);
    setItineraryName('');
    setCurrentItinerary([]);
  };

  // ===== Budget Calculation =====
  const calculateTotalBudget = (): number => {
    return currentItinerary.reduce((total, item) => {
      const dest = destinations.find((d) => d.id === item.destinationId);
      if (!dest) return total;
      return total + dest.foodCost + dest.transportCost + dest.accommodationCost;
    }, 0);
  };

  const getBudgetBreakdown = (): BudgetItem[] => {
    const breakdown: Record<string, number> = {
      'Ăn uống': 0,
      'Di chuyển': 0,
      'Lưu trú': 0,
    };

    currentItinerary.forEach((item) => {
      const dest = destinations.find((d) => d.id === item.destinationId);
      if (!dest) return;
      breakdown['Ăn uống'] += dest.foodCost;
      breakdown['Di chuyển'] += dest.transportCost;
      breakdown['Lưu trú'] += dest.accommodationCost;
    });

    return Object.entries(breakdown).map(([category, amount]) => ({
      category: category as any,
      amount,
    }));
  };

  // ===== Filtered Destinations =====
  const filteredDestinations = destinations.filter((d) => {
    if (filterType && d.type !== filterType) return false;
    const totalCost = d.foodCost + d.transportCost + d.accommodationCost;
    if (totalCost < priceRange[0] || totalCost > priceRange[1]) return false;
    if (d.rating < minRating) return false;
    return true;
  });

  // ===== Statistics =====
  const stats = {
    totalDestinations: destinations.length,
    totalItineraries: itineraries.length,
    popularDestination: destinations.length > 0 ? destinations[0].name : 'N/A',
  };

  const totalBudget = calculateTotalBudget();
  const budgetBreakdown = getBudgetBreakdown();
  const isOverBudget = currentBudget > 0 && totalBudget > currentBudget;

  // Chart data
  const chartData = budgetBreakdown.map((item) => ({
    type: item.category,
    value: item.amount,
  }));

  const pieConfig = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  };

  // ===== Responsive =====
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  return (
    <div style={{ padding: isMobile ? 12 : 24 }}>
      <h1 style={{ fontSize: isMobile ? 20 : 28 }}>Lập kế hoạch Du lịch</h1>

      <Tabs defaultActiveKey="home">
        <TabPane tab="Trang chủ" key="home">
          <Card title="Khám phá điểm đến" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
              <Select
                placeholder="Lọc theo loại"
                style={{ width: isMobile ? '100%' : 200 }}
                allowClear
                value={filterType}
                onChange={setFilterType}
              >
                <Option value="Biển">Biển</Option>
                <Option value="Núi">Núi</Option>
                <Option value="Thành phố">Thành phố</Option>
              </Select>
              <div>
                <div>Khoảng giá: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</div>
                <Slider
                  range
                  min={0}
                  max={10000000}
                  step={100000}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                />
              </div>
              <div>
                <div>Đánh giá tối thiểu:</div>
                <Rate value={minRating} onChange={setMinRating} />
              </div>
            </Space>

            <Row gutter={[16, 16]}>
              {filteredDestinations.map((dest) => (
                <Col xs={24} sm={12} md={8} lg={6} key={dest.id}>
                  <Card
                    hoverable
                    cover={
                      dest.image ? (
                        <img
                          alt={dest.name}
                          src={dest.image}
                          style={{ height: 200, objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 200,
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EnvironmentOutlined style={{ fontSize: 48, color: '#ccc' }} />
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={dest.name}
                      description={
                        <>
                          <Tag color={getLocationTypeColor(dest.type)}>{dest.type}</Tag>
                          <div style={{ marginTop: 8 }}>
                            <Rate disabled value={dest.rating} />
                          </div>
                          <div style={{ marginTop: 8 }}>
                            {formatCurrency(
                              dest.foodCost + dest.transportCost + dest.accommodationCost,
                            )}
                          </div>
                        </>
                      }
                    />
                    <Button
                      type="primary"
                      block
                      style={{ marginTop: 12 }}
                      onClick={() => addToItinerary(dest.id)}
                    >
                      Thêm vào lịch trình
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="Lịch trình" key="itinerary">
          <Card
            title="Lịch trình của tôi"
            extra={
              currentItinerary.length > 0 && (
                <Button type="primary" onClick={() => setSaveItineraryVisible(true)}>
                  Lưu lịch trình
                </Button>
              )
            }
          >
            {currentItinerary.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                Chưa có điểm đến nào. Thêm từ Trang chủ!
              </div>
            ) : (
              <List
                dataSource={currentItinerary}
                renderItem={(item) => {
                  const dest = destinations.find((d) => d.id === item.destinationId);
                  if (!dest) return null;
                  return (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          danger
                          onClick={() => removeFromItinerary(item.id)}
                        >
                          Xóa
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<EnvironmentOutlined />} />}
                        title={dest.name}
                        description={
                          <>
                            <div>
                              <ClockCircleOutlined /> {dest.visitDuration} giờ
                            </div>
                            <div>
                              <DollarOutlined />{' '}
                              {formatCurrency(
                                dest.foodCost + dest.transportCost + dest.accommodationCost,
                              )}
                            </div>
                          </>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Ngân sách" key="budget">
          <Card title="Quản lý Ngân sách">
            <div style={{ marginBottom: 16 }}>
              <label>Ngân sách dự kiến:</label>
              <InputNumber
                style={{ width: '100%', marginTop: 8 }}
                value={currentBudget}
                onChange={(value) => setCurrentBudget(value || 0)}
                addonAfter="đ"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </div>

            {isOverBudget && (
              <Alert
                message="Cảnh báo vượt ngân sách!"
                description={`Bạn đã vượt ${formatCurrency(totalBudget - currentBudget)}`}
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={24} md={12}>
                <Statistic title="Tổng chi phí" value={totalBudget} suffix="đ" />
              </Col>
              <Col xs={24} md={12}>
                <Statistic
                  title="Còn lại"
                  value={Math.max(0, currentBudget - totalBudget)}
                  suffix="đ"
                  valueStyle={{ color: isOverBudget ? '#cf1322' : '#3f8600' }}
                />
              </Col>
            </Row>

            {chartData.length > 0 && (
              <div>
                <h3>Phân bổ ngân sách</h3>
                <Pie {...pieConfig} />
              </div>
            )}

            <Table
              style={{ marginTop: 24 }}
              dataSource={budgetBreakdown}
              rowKey="category"
              pagination={false}
              columns={[
                { title: 'Hạng mục', dataIndex: 'category' },
                {
                  title: 'Số tiền',
                  dataIndex: 'amount',
                  render: (amount: number) => formatCurrency(amount),
                },
              ]}
            />
          </Card>
        </TabPane>

        <TabPane tab="Quản trị" key="admin">
          <Card
            title="Quản lý Điểm đến"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingDest(null);
                  setDestFormVisible(true);
                }}
              >
                Thêm điểm đến
              </Button>
            }
            style={{ marginBottom: 16 }}
          >
            <Table
              dataSource={destinations}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
              columns={[
                { title: 'Tên', dataIndex: 'name', width: 150 },
                {
                  title: 'Loại',
                  dataIndex: 'type',
                  render: (type: string) => <Tag color={getLocationTypeColor(type)}>{type}</Tag>,
                },
                { title: 'Thời gian (h)', dataIndex: 'visitDuration', width: 120 },
                {
                  title: 'Tổng chi phí',
                  render: (_: any, record: Destination) =>
                    formatCurrency(
                      record.foodCost + record.transportCost + record.accommodationCost,
                    ),
                },
                {
                  title: 'Rating',
                  dataIndex: 'rating',
                  render: (rating: number) => <Rate disabled value={rating} />,
                },
                {
                  title: 'Thao tác',
                  width: 150,
                  render: (_: any, record: Destination) => (
                    <Space>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setEditingDest(record);
                          setDestFormVisible(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Popconfirm
                        title="Xác nhận xóa?"
                        onConfirm={() => handleDeleteDestination(record.id)}
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
              ]}
            />
          </Card>

          <Card title="Thống kê">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Statistic title="Tổng điểm đến" value={stats.totalDestinations} />
              </Col>
              <Col xs={24} md={8}>
                <Statistic title="Lịch trình đã tạo" value={stats.totalItineraries} />
              </Col>
              <Col xs={24} md={8}>
                <Statistic title="Điểm phổ biến" value={stats.popularDestination} />
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* Forms */}
      <DestinationForm
        visible={destFormVisible}
        onCancel={() => {
          setDestFormVisible(false);
          setEditingDest(null);
        }}
        onSubmit={editingDest ? handleEditDestination : handleAddDestination}
        initialValues={editingDest}
      />

      <Modal
        title="Lưu lịch trình"
        visible={saveItineraryVisible}
        onCancel={() => setSaveItineraryVisible(false)}
        onOk={saveItinerary}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Tên lịch trình"
          value={itineraryName}
          onChange={(e) => setItineraryName(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default TravelPlanner;
