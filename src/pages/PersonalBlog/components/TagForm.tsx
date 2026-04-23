import { Button, Form, Input, Select, Tag } from 'antd';
import { useEffect } from 'react';
import { Tag as TagType } from '../types';
import { TAG_COLORS } from '../utils';

interface Props {
  tag?: TagType | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const TagForm: React.FC<Props> = ({ tag, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (tag) form.setFieldsValue(tag);
    else form.resetFields();
  }, [tag]);

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={onSubmit}>
      <Form.Item name="name" label="Tên thẻ" rules={[{ required: true, message: 'Nhập tên thẻ' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="color" label="Màu sắc" initialValue="blue" rules={[{ required: true }]}>
        <Select
          options={TAG_COLORS.map((c) => ({
            value: c,
            label: <Tag color={c}>{c}</Tag>,
          }))}
        />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </Form>
  );
};

export default TagForm;