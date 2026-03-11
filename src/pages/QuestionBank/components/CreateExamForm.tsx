// src/pages/question-bank/components/CreateExamForm.tsx

import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { ExamStructure, Subject } from '../types';

interface CreateExamFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  examStructures: ExamStructure[];
  subjects: Subject[];
}

const CreateExamForm: React.FC<CreateExamFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  examStructures,
  subjects,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Tạo đề thi"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Tạo đề"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên đề thi"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên đề thi' }]}
        >
          <Input placeholder="VD: Đề thi giữa kỳ 2024, Đề thi thử..." />
        </Form.Item>
        <Form.Item
          label="Chọn cấu trúc đề thi"
          name="structureId"
          rules={[{ required: true, message: 'Vui lòng chọn cấu trúc' }]}
        >
          <Select placeholder="Chọn cấu trúc">
            {examStructures.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name} ({subjects.find((sub) => sub.id === s.subjectId)?.name})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateExamForm;
