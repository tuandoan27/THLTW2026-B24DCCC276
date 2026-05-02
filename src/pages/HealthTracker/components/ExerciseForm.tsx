import { Button, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { Exercise } from '../types';

const { TextArea } = Input;

interface Props {
  exercise?: Exercise | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const ExerciseForm: React.FC<Props> = ({ exercise, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (exercise) form.setFieldsValue(exercise);
    else form.resetFields();
  }, [exercise]);

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={onSubmit}>
      <Form.Item name="name" label="Tên bài tập" rules={[{ required: true, message: 'Nhập tên' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true, message: 'Chọn nhóm cơ' }]}>
        <Select options={['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'].map((v) => ({ value: v, label: v }))} />
      </Form.Item>
      <Form.Item name="difficulty" label="Mức độ khó" rules={[{ required: true, message: 'Chọn mức độ' }]}>
        <Select options={['Dễ', 'Trung bình', 'Khó'].map((v) => ({ value: v, label: v }))} />
      </Form.Item>
      <Form.Item name="description" label="Mô tả ngắn" rules={[{ required: true, message: 'Nhập mô tả' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="instructions" label="Hướng dẫn thực hiện" rules={[{ required: true, message: 'Nhập hướng dẫn' }]}>
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item name="caloriesPerHour" label="Calo đốt/giờ" rules={[{ required: true, message: 'Nhập calo' }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </Form>
  );
};

export default ExerciseForm;