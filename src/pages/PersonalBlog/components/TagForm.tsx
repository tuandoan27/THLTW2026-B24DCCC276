import { Button, Form, Input, Select, Tag as AntTag } from 'antd';
import { useEffect } from 'react';
import { Tag } from '../types';
import { TAG_COLORS } from '../utils';

interface Props {
  tag?: Tag | null;
  isEdit: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const TagForm: React.FC<Props> = ({ tag, isEdit, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (tag) {
      form.setFieldsValue({ name: tag.name, color: tag.color });
    } else {
      form.resetFields();
    }
  }, [tag]);

  return (
    <Form form={form} labelCol={{ span: 24 }} onFinish={onSubmit}>
      <Form.Item
        name="name"
        label="Tên thẻ"
        rules={[
          { required: true, message: 'Vui lòng nhập tên thẻ' },
          { max: 30, message: 'Tối đa 30 ký tự' },
        ]}
      >
        <Input placeholder="Nhập tên thẻ (vd: React, CSS...)" />
      </Form.Item>

      <Form.Item
        name="color"
        label="Màu sắc"
        initialValue="blue"
        rules={[{ required: true, message: 'Vui lòng chọn màu' }]}
      >
        <Select
          options={TAG_COLORS.map((c) => ({
            value: c,
            label: (
              <AntTag color={c} style={{ margin: 0 }}>
                {c}
              </AntTag>
            ),
          }))}
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

export default TagForm;