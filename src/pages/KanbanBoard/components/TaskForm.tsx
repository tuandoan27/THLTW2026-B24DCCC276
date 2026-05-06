import { Button, DatePicker, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { Task } from '../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Props {
  task?: Task | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<Props> = ({ task, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (task) form.setFieldsValue({ ...task, deadline: dayjs(task.deadline) });
    else form.resetFields();
  }, [task]);

  const handleFinish = (values: any) => {
    onSubmit({ ...values, deadline: values.deadline.format('YYYY-MM-DD'), tags: values.tags || [] });
  };

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={handleFinish}>
      <Form.Item name="name" label="Tên task" rules={[{ required: true, message: 'Nhập tên task' }]}>
        <Input placeholder="Nhập tên công việc" />
      </Form.Item>
      <Form.Item name="description" label="Mô tả">
        <TextArea rows={3} placeholder="Mô tả công việc" />
      </Form.Item>
      <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn deadline' }]}>
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      <Form.Item name="priority" label="Mức độ ưu tiên" initialValue="Trung bình" rules={[{ required: true }]}>
        <Select options={['Cao', 'Trung bình', 'Thấp'].map((v) => ({ value: v, label: v }))} />
      </Form.Item>
      <Form.Item name="tags" label="Tags">
        <Select mode="tags" placeholder="Nhập tag rồi Enter" />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" initialValue="todo" rules={[{ required: true }]}>
        <Select options={[
          { value: 'todo', label: 'Cần làm' },
          { value: 'doing', label: 'Đang làm' },
          { value: 'done', label: 'Hoàn thành' },
        ]} />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </Form>
  );
};

export default TaskForm;