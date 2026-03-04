
import React, { useEffect } from 'react';
import { Form, Modal, Select, InputNumber } from 'antd';
import type { MonthlyGoal, Subject } from '../types';
import { getCurrentMonth, formatMonth } from '../utils';

interface GoalFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: MonthlyGoal | null;
  subjects: Subject[];
}

const GoalForm: React.FC<GoalFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  subjects,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({ month: getCurrentMonth() });
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  const generateMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const value = `${year}-${month}`;
      months.push({ value, label: formatMonth(value) });
    }
    return months;
  };

  return (
    <Modal
      title={initialValues ? 'Sửa mục tiêu' : 'Thêm mục tiêu học tập'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tháng"
          name="month"
          rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
        >
          <Select placeholder="Chọn tháng">
            {generateMonths().map((month) => (
              <Select.Option key={month.value} value={month.value}>
                Tháng {month.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Môn học"
          name="subjectId"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select placeholder="Chọn môn học hoặc tổng thể">
            <Select.Option value={null}>
              <strong>Tổng thể (tất cả môn)</strong>
            </Select.Option>
            {subjects.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mục tiêu (giờ)"
          name="targetHours"
          rules={[
            { required: true, message: 'Vui lòng nhập mục tiêu' },
            { type: 'number', min: 1, message: 'Mục tiêu phải lớn hơn 0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="VD: 20, 40, 60..."
            min={1}
            addonAfter="giờ"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoalForm;