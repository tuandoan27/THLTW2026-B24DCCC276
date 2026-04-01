
import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'antd';
import type { Diploma, GraduationDecision, CustomField, DiplomaBook } from '../types';

interface DiplomaFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Diploma | null;
  decisions: GraduationDecision[];
  customFields: CustomField[];
  books: DiplomaBook[];
  currentBookNumber: number; // Số vào sổ hiện tại
}

const DiplomaForm: React.FC<DiplomaFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  decisions,
  customFields,
  books,
  currentBookNumber,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          birthDate: initialValues.birthDate,
          ...initialValues.customData,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ bookNumber: currentBookNumber });
      }
    }
  }, [visible, initialValues, form, currentBookNumber]);

  const handleSubmit = () => {
  form.validateFields().then((values) => {
    const {
      birthDate,
      diplomaNumber,
      studentCode,
      fullName,
      decisionId,
      ...rest
    } = values;

    const customData = rest as Record<string, any>;

    const formattedValues = {
      diplomaNumber,
      studentCode,
      fullName,
      birthDate:
        typeof birthDate === 'string'
          ? birthDate
          : birthDate.format('YYYY-MM-DD'),
      decisionId,
      customData: {} as Record<string, any>, // ✅ FIX
    };

    customFields.forEach((field) => {
      let value = customData[field.name];

      if (field.type === 'Date' && value) {
        value =
          typeof value === 'string'
            ? value
            : value.format('YYYY-MM-DD');
      }

      formattedValues.customData[field.name] = value;
    });

    onSubmit(formattedValues);
    form.resetFields();
  });
};

  return (
    <Modal
      title={initialValues ? 'Sửa thông tin văn bằng' : 'Thêm văn bằng'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={700}
    >
      <Form form={form} layout="vertical">
        {!initialValues && (
          <Form.Item label="Số vào sổ" name="bookNumber">
            <InputNumber disabled style={{ width: '100%' }} />
          </Form.Item>
        )}
        <Form.Item
          label="Số hiệu văn bằng"
          name="diplomaNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số hiệu' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mã sinh viên"
          name="studentCode"
          rules={[{ required: true, message: 'Vui lòng nhập MSV' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="birthDate"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          label="Quyết định tốt nghiệp"
          name="decisionId"
          rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
        >
          <Select placeholder="Chọn quyết định">
            {decisions.map((d) => (
              <Select.Option key={d.id} value={d.id}>
                {d.decisionNumber} - {d.summary}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <h4>Thông tin bổ sung:</h4>
        {customFields.map((field) => (
          <Form.Item
            key={field.id}
            label={field.name}
            name={field.name}
          >
            {field.type === 'String' && <Input />}
            {field.type === 'Number' && <InputNumber style={{ width: '100%' }} />}
            {field.type === 'Date' && (
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default DiplomaForm;
