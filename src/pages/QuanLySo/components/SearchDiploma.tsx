
import React, { useState } from 'react';
import { Form, Input, Button, Card, DatePicker, message, Table, Descriptions, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Diploma, GraduationDecision, CustomField } from '../types';
import { validateSearchParams, formatDate } from '../utils';

interface SearchDiplomaProps {
  diplomas: Diploma[];
  decisions: GraduationDecision[];
  customFields: CustomField[];
  onSearch: (decisionId: number) => void;
}

const SearchDiploma: React.FC<SearchDiplomaProps> = ({
  diplomas,
  decisions,
  customFields,
  onSearch,
}) => {
  const [form] = Form.useForm();
  const [results, setResults] = useState<Diploma[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<Diploma | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    const params: any = {};

    if (values.diplomaNumber) params.diplomaNumber = values.diplomaNumber;
    if (values.bookNumber) params.bookNumber = values.bookNumber;
    if (values.studentCode) params.studentCode = values.studentCode;
    if (values.fullName) params.fullName = values.fullName;
    if (values.birthDate) {
      params.birthDate =
        typeof values.birthDate === 'string'
          ? values.birthDate
          : values.birthDate.format('YYYY-MM-DD');
    }

    if (!validateSearchParams(params)) {
      message.error('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
      return;
    }

    const filtered = diplomas.filter((d) => {
      if (params.diplomaNumber && !d.diplomaNumber.includes(params.diplomaNumber))
        return false;
      if (params.bookNumber && d.bookNumber !== parseInt(params.bookNumber)) return false;
      if (params.studentCode && !d.studentCode.includes(params.studentCode)) return false;
      if (params.fullName && !d.fullName.toLowerCase().includes(params.fullName.toLowerCase()))
        return false;
      if (params.birthDate && d.birthDate !== params.birthDate) return false;
      return true;
    });

    setResults(filtered);

    // Ghi nhận lượt tra cứu
    if (filtered.length > 0) {
      const decisionIds = [...new Set(filtered.map((d) => d.decisionId))];
      decisionIds.forEach((id) => onSearch(id));
    }

    if (filtered.length === 0) {
      message.info('Không tìm thấy kết quả');
    }
  };

  const handleViewDetail = (diploma: Diploma) => {
    setSelectedDiploma(diploma);
    setDetailVisible(true);
  };

  const columns = [
    { title: 'Số vào sổ', dataIndex: 'bookNumber', width: 100 },
    { title: 'Số hiệu VB', dataIndex: 'diplomaNumber', width: 150 },
    { title: 'MSV', dataIndex: 'studentCode', width: 120 },
    { title: 'Họ tên', dataIndex: 'fullName' },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: '',
      width: 100,
      render: (_: any, record: Diploma) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const decision = selectedDiploma
    ? decisions.find((d) => d.id === selectedDiploma.decisionId)
    : null;

  return (
    <div>
      <Card title="Tìm kiếm văn bằng" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item name="diplomaNumber" style={{ marginBottom: 8 }}>
            <Input placeholder="Số hiệu văn bằng" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="bookNumber" style={{ marginBottom: 8 }}>
            <Input placeholder="Số vào sổ" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="studentCode" style={{ marginBottom: 8 }}>
            <Input placeholder="Mã sinh viên" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item name="fullName" style={{ marginBottom: 8 }}>
            <Input placeholder="Họ tên" style={{ width: 180 }} />
          </Form.Item>
          <Form.Item name="birthDate" style={{ marginBottom: 8 }}>
            <DatePicker placeholder="Ngày sinh" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
        <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
          * Yêu cầu nhập ít nhất 2 tham số
        </div>
      </Card>

      {results.length > 0 && (
        <Card title={`Kết quả tìm kiếm (${results.length})`}>
          <Table rowKey="id" columns={columns} dataSource={results} pagination={false} />
        </Card>
      )}

      <Modal
        title="Chi tiết văn bằng"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDiploma && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Số vào sổ">
                {selectedDiploma.bookNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Số hiệu VB">
                {selectedDiploma.diplomaNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Mã sinh viên">
                {selectedDiploma.studentCode}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên">{selectedDiploma.fullName}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {formatDate(selectedDiploma.birthDate)}
              </Descriptions.Item>
              {customFields.map((field) => (
                <Descriptions.Item key={field.id} label={field.name}>
                  {field.type === 'Date' && selectedDiploma.customData[field.name]
                    ? formatDate(selectedDiploma.customData[field.name])
                    : selectedDiploma.customData[field.name] || '---'}
                </Descriptions.Item>
              ))}
            </Descriptions>

            {decision && (
              <>
                <h4 style={{ marginTop: 16 }}>Quyết định tốt nghiệp</h4>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Số QĐ">
                    {decision.decisionNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày ban hành">
                    {formatDate(decision.issueDate)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trích yếu">{decision.summary}</Descriptions.Item>
                </Descriptions>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default SearchDiploma;
