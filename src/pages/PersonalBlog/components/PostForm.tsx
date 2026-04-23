import { Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { Post, Tag } from '../types';

const { TextArea } = Input;

interface Props {
  post?: Post | null;
  tags: Tag[];
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const PostForm: React.FC<Props> = ({ post, tags, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (post) form.setFieldsValue(post);
    else form.resetFields();
  }, [post]);

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={onSubmit}>
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Nhập slug' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true, message: 'Nhập tóm tắt' }]}>
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="content" label="Nội dung (Markdown)" rules={[{ required: true, message: 'Nhập nội dung' }]}>
        <TextArea rows={7} />
      </Form.Item>
      <Form.Item name="thumbnail" label="Ảnh đại diện (URL)">
        <Input />
      </Form.Item>
      <Form.Item name="tags" label="Thẻ">
        <Select mode="multiple" options={tags.map((t) => ({ value: t.id, label: t.name }))} />
      </Form.Item>
      <Form.Item name="status" label="Trạng thái" initialValue="draft" rules={[{ required: true }]}>
        <Select options={[{ value: 'published', label: 'Đã đăng' }, { value: 'draft', label: 'Nháp' }]} />
      </Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </Form>
  );
};

export default PostForm;