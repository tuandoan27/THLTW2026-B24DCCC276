// src/pages/question-bank/components/ExamStructureForm.tsx

import React, { useState } from 'react';
import { Form, Input, Modal, Select, InputNumber, Space, Button, Table, Tag } from 'antd';
import type { Subject, KnowledgeBlock, ExamStructureItem, Difficulty } from '../types';
import { getDifficultyColor } from '../utils';

interface ExamStructureFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any, items: ExamStructureItem[]) => void;
  subjects: Subject[];
  knowledgeBlocks: KnowledgeBlock[];
}

const ExamStructureForm: React.FC<ExamStructureFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  subjects,
  knowledgeBlocks,
}) => {
  const [form] = Form.useForm();
  const [structureItems, setStructureItems] = useState<ExamStructureItem[]>([]);

  const handleAddItem = () => {
    form.validateFields(['difficulty', 'knowledgeBlockId', 'quantity']).then((values) => {
      setStructureItems([
        ...structureItems,
        {
          difficulty: values.difficulty,
          knowledgeBlockId: values.knowledgeBlockId,
          quantity: values.quantity,
        },
      ]);
      form.setFieldsValue({
        difficulty: undefined,
        knowledgeBlockId: undefined,
        quantity: undefined,
      });
    });
  };

  const handleRemoveItem = (index: number) => {
    setStructureItems(structureItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (structureItems.length === 0) {
      return;
    }
    form.validateFields(['name', 'subjectId']).then((values) => {
      onSubmit(values, structureItems);
      setStructureItems([]);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setStructureItems([]);
    form.resetFields();
    onCancel();
  };

  const columns = [
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      render: (d: Difficulty) => <Tag color={getDifficultyColor(d)}>{d}</Tag>,
    },
    {
      title: 'Khối kiến thức',
      dataIndex: 'knowledgeBlockId',
      render: (id: number) => knowledgeBlocks.find((kb) => kb.id === id)?.name || '---',
    },
    { title: 'Số lượng', dataIndex: 'quantity' },
    {
      title: '',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button type="link" danger onClick={() => handleRemoveItem(index)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Tạo cấu trúc đề thi"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Lưu cấu trúc"
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên cấu trúc"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="VD: Đề thi giữa kỳ, Đề thi cuối kỳ..." />
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

        <h4>Thêm yêu cầu câu hỏi:</h4>
        <Space style={{ marginBottom: 16 }}>
          <Form.Item label="Độ khó" name="difficulty" style={{ marginBottom: 0 }}>
            <Select style={{ width: 120 }} placeholder="Độ khó">
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
              <Select.Option value="Rất khó">Rất khó</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Khối KT" name="knowledgeBlockId" style={{ marginBottom: 0 }}>
            <Select style={{ width: 150 }} placeholder="Khối KT">
              {knowledgeBlocks.map((kb) => (
                <Select.Option key={kb.id} value={kb.id}>
                  {kb.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Số lượng" name="quantity" style={{ marginBottom: 0 }}>
            <InputNumber min={1} placeholder="SL" />
          </Form.Item>
          <Button onClick={handleAddItem} style={{ marginTop: 30 }}>
            Thêm
          </Button>
        </Space>

        {structureItems.length > 0 && (
          <Table
            rowKey={(_, i) => i!}
            dataSource={structureItems}
            columns={columns}
            pagination={false}
            size="small"
          />
        )}
      </Form>
    </Modal>
  );
};

export default ExamStructureForm;
