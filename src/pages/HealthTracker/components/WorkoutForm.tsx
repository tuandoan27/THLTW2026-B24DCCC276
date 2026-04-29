import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { Workout } from '../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Props {
  workout?: Workout | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const WorkoutForm: React.FC<Props> = ({ workout, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (workout) form.setFieldsValue({ ...workout, date: dayjs(workout.date) });
    else form.resetFields();
  }, [workout]);

  const handleFinish = (values: any) => {
    onSubmit({ ...values, date: values.date.format('YYYY-MM-DD') });
  };

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={handleFinish}>
      <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Chọn ngày' }]}>
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Chọn loại' }]}>
        <Select options={['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'].map((v) => ({ value: v, label: v }))} />
      </Form.Item>
      <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Nhập thời lượng' }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="calories" label="Calo đốt" rules={[{ required: true, message: 'Nhập calo' }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="note" label="Ghi chú">
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" initialValue="Hoàn thành" rules={[{ required: true }]}>
        <Select options={[{ value: 'Hoàn thành', label: 'Hoàn thành' }, { value: 'Bỏ lỡ', label: 'Bỏ lỡ' }]} />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </Form>
  );
};

export default WorkoutForm;