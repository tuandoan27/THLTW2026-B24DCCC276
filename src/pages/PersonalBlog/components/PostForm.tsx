import { Button, Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import { Post, Tag } from '../types';
import { TAG_COLORS, generateSlug } from '../utils';

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
    if (post) {
      form.setFieldsValue({ ...post });
    } else {
      form.resetFields();
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!isEdit) {
    form.setFieldsValue({
      slug: generateSlug(e.target.value),
    });
  }
};

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={onSubmit}>
      <Form.Item
        name="title"
        label="Tiêu đề"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
      >
        <Input placeholder="Nhập tiêu đề bài viết" onChange={handleTitleChange} />
      </Form.Item>

      <Form.Item
        name="slug"
        label="Slug"
        rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
      >
        <Input placeholder="ten-bai-viet" />
      </Form.Item>

      <Form.Item
        name="summary"
        label="Tóm tắt"
        rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
      >
        <TextArea rows={3} placeholder="Tóm tắt ngắn gọn về bài viết" />
      </Form.Item>

      <Form.Item
        name="content"
        label="Nội dung (Markdown)"
        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
      >
        <TextArea rows={8} placeholder="Nội dung bài viết (hỗ trợ Markdown)" />
      </Form.Item>

      <Form.Item name="thumbnail" label="Ảnh đại diện (URL)">
        <Input placeholder="https://example.com/image.jpg" />
      </Form.Item>

      <Form.Item name="tags" label="Thẻ">
        <Select
          mode="multiple"
          placeholder="Chọn thẻ"
          options={tags.map((t) => ({ value: t.id, label: t.name }))}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng thái"
        initialValue="draft"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select
          options={[
            { value: 'published', label: 'Đã đăng' },
            { value: 'draft', label: 'Nháp' },
          ]}
        />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={onCancel}>Hủy</Button>
        <Button htmlType="submit" type="primary">
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </Form>
  );
};

export default PostForm;