
import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker } from 'antd';
import type { GraduationDecision, DiplomaBook } from '../types';

interface GraduationDecisionFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: GraduationDecision | null;
  books: DiplomaBook[];
}

const GraduationDecisionForm: React.FC<GraduationDecisionFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  books,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          issueDate: initialValues.issueDate,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        issueDate:
          typeof values.issueDate === 'string'
            ? values.issueDate
            : values.issueDate.format('YYYY-MM-DD'),
      };
      onSubmit(formattedValues);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa quyết định' : 'Thêm quyết định tốt nghiệp'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Số quyết định"
          name="decisionNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}
        >
          <Input placeholder="VD: 123/QĐ-ĐHBK" />
        </Form.Item>
        <Form.Item
          label="Ngày ban hành"
          name="issueDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Trích yếu"
          name="summary"
          rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
        >
          <Input.TextArea rows={3} placeholder="VD: Công nhận tốt nghiệp..." />
        </Form.Item>
        <Form.Item
          label="Sổ văn bằng"
          name="bookId"
          rules={[{ required: true, message: 'Vui lòng chọn sổ' }]}
        >
          <Select placeholder="Chọn sổ văn bằng">
            {books.map((book) => (
              <Select.Option key={book.id} value={book.id}>
                {book.name} (Năm {book.year})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GraduationDecisionForm;
