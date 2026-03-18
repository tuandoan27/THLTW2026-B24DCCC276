// src/pages/appointment-booking/components/AppointmentForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker, TimePicker, message } from 'antd';
import type { Appointment, Employee, Service } from '../types';
import {
  checkAppointmentConflict,
  checkEmployeeDailyLimit,
  isEmployeeWorking,
} from '../utils';

interface AppointmentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Appointment | null;
  employees: Employee[];
  services: Service[];
  appointments: Appointment[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  employees,
  services,
  appointments,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          date: initialValues.date,
          time: initialValues.time,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const date = typeof values.date === 'string' ? values.date : values.date.format('YYYY-MM-DD');
      const time = typeof values.time === 'string' ? values.time : values.time.format('HH:mm');
      const employeeId = values.employeeId;

      // Kiểm tra nhân viên có làm việc không
      const employee = employees.find((e) => e.id === employeeId);
      if (employee && !isEmployeeWorking(employee, date, time)) {
        message.error('Nhân viên không làm việc vào thời gian này');
        return;
      }

      // Kiểm tra lịch trùng
      if (checkAppointmentConflict(appointments, employeeId, date, time, initialValues?.id)) {
        message.error('Lịch hẹn bị trùng với lịch khác');
        return;
      }

      // Kiểm tra giới hạn khách/ngày
      if (employee && checkEmployeeDailyLimit(appointments, employee, date, initialValues?.id)) {
        message.error('Nhân viên đã đủ số khách trong ngày');
        return;
      }

      onSubmit({
        ...values,
        date,
        time,
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa lịch hẹn' : 'Đặt lịch hẹn'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Đặt lịch'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên khách hàng"
          name="customerName"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="customerPhone"
          rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Dịch vụ"
          name="serviceId"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
        >
          <Select>
            {services.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name} - {s.price.toLocaleString()}đ ({s.duration} phút)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Nhân viên"
          name="employeeId"
          rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
        >
          <Select>
            {employees.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Ngày"
          name="date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Giờ"
          name="time"
          rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentForm;
