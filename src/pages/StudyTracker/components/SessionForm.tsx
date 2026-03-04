
import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'antd';
import type { StudySession, Subject } from '../types';

interface SessionFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: StudySession | null;
  subjects: Subject[];
}

const SessionForm: React.FC<SessionFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  subjects,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          date: initialValues.date,
          startTime: initialValues.startTime,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues: any = {
        ...values,
        date:
          typeof values.date === 'string'
            ? values.date
            : values.date.format('YYYY-MM-DD'),
      };
      onSubmit(formattedValues);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Sửa lịch học' : 'Thêm lịch học'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Môn học"
          name="subjectId"
          rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
        >
          <Select placeholder="Chọn môn học">
            {subjects.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày học"
          name="date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày học' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="Giờ bắt đầu"
          name="startTime"
          rules={[{ required: true, message: 'Vui lòng nhập giờ bắt đầu' }]}
        >
          <Input type="time" />
        </Form.Item>

        <Form.Item
          label="Thời lượng (phút)"
          name="duration"
          rules={[
            { required: true, message: 'Vui lòng nhập thời lượng' },
            { type: 'number', min: 1, message: 'Thời lượng phải lớn hơn 0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="VD: 60, 90, 120..."
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung đã học"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="VD: Học phương trình bậc 2, ôn tập ngữ pháp..."
          />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea
            rows={2}
            placeholder="Ghi chú thêm (nếu có)..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SessionForm;