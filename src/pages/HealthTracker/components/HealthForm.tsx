import { Button, DatePicker, Form, InputNumber } from 'antd';
import { useEffect } from 'react';
import { HealthLog } from '../types';
import dayjs from 'dayjs';

interface Props {
  log?: HealthLog | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const HealthForm: React.FC<Props> = ({ log, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (log) form.setFieldsValue({ ...log, date: dayjs(log.date) });
    else form.resetFields();
  }, [log]);

  const handleFinish = (values: any) => {
    onSubmit({ ...values, date: values.date.format('YYYY-MM-DD') });
  };

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={handleFinish}>
      <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Chọn ngày' }]}>
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Nhập cân nặng' }]}>
        <InputNumber min={1} max={300} step={0.1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true, message: 'Nhập chiều cao' }]}>
        <InputNumber min={1} max={250} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="heartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Nhập nhịp tim' }]}>
        <InputNumber min={1} max={250} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true, message: 'Nhập giờ ngủ' }]}>
        <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </Form>
  );
};

export default HealthForm;