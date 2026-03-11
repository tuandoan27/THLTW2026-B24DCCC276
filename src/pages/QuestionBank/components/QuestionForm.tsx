// src/pages/question-bank/components/QuestionForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { Question, Subject, KnowledgeBlock } from '../types';

interface QuestionFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Question | null;
  subjects: Subject[];
  knowledgeBlocks: KnowledgeBlock[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  subjects,
  knowledgeBlocks,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã câu hỏi"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi' }]}
        >
          <Input placeholder="VD: CH001, Q001..." />
        </Form.Item>
        <Form.Item
          label="Môn học"
          name="subjectId"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select placeholder="Chọn môn học">
            {subjects.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Nội dung câu hỏi"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập nội dung câu hỏi..." />
        </Form.Item>
        <Form.Item
          label="Độ khó"
          name="difficulty"
          rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}
        >
          <Select placeholder="Chọn độ khó">
            <Select.Option value="Dễ">Dễ</Select.Option>
            <Select.Option value="Trung bình">Trung bình</Select.Option>
            <Select.Option value="Khó">Khó</Select.Option>
            <Select.Option value="Rất khó">Rất khó</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Khối kiến thức"
          name="knowledgeBlockId"
          rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
        >
          <Select placeholder="Chọn khối kiến thức">
            {knowledgeBlocks.map((kb) => (
              <Select.Option key={kb.id} value={kb.id}>
                {kb.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuestionForm;
