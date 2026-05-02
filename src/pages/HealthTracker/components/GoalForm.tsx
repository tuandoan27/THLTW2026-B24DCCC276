import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { Goal } from '../types';
import dayjs from 'dayjs';

interface Props {
  visible: boolean;
  goal?: Goal | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const GoalForm: React.FC<Props> = ({ visible, goal, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (goal) form.setFieldsValue({ ...goal, deadline: dayjs(goal.deadline) });
    else form.resetFields();
  }, [goal, visible]);

  const handleFinish = (values: any) => {
    onSubmit({ ...values, deadline: values.deadline.format('YYYY-MM-DD') });
  };

  return (
    <Drawer
      title={isEdit ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
      visible={visible}
      onClose={onCancel}
      width={400}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" onClick={() => form.submit()}>{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
        </div>
      }
    >
      <Form form={form} labelCol={{ span: 24 }} onFinish={handleFinish}>
        <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Nhập tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Loại" rules={[{ required: true, message: 'Chọn loại' }]}>
          <Select options={['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'].map((v) => ({ value: v, label: v }))} />
        </Form.Item>
        <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Nhập giá trị' }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="currentValue" label="Giá trị hiện tại" initialValue={0} rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn deadline' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái" initialValue="Đang thực hiện" rules={[{ required: true }]}>
          <Select options={['Đang thực hiện', 'Đã đạt', 'Đã hủy'].map((v) => ({ value: v, label: v }))} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GoalForm;