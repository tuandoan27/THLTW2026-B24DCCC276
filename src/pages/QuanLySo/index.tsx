
import React, { useState, useEffect } from 'react';
import { Tabs, Card, Table, Button, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type {
  DiplomaBook,
  GraduationDecision,
  CustomField,
  Diploma,
} from './types';
import DiplomaBookForm from './components/DiplomaBookForm';
import GraduationDecisionForm from './components/GraduationDecisionForm';
import CustomFieldForm from './components/CustomFieldForm';
import DiplomaForm from './components/DiplomaForm';
import SearchDiploma from './components/SearchDiploma';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  formatDate,
  getFieldTypeLabel,
} from './utils';

const { TabPane } = Tabs;

const DiplomaManagement: React.FC = () => {
  const [books, setBooks] = useState<DiplomaBook[]>(() =>
    getFromLocalStorage('dm_books', []),
  );
  const [decisions, setDecisions] = useState<GraduationDecision[]>(() =>
    getFromLocalStorage('dm_decisions', []),
  );
  const [customFields, setCustomFields] = useState<CustomField[]>(() =>
    getFromLocalStorage('dm_custom_fields', []),
  );
  const [diplomas, setDiplomas] = useState<Diploma[]>(() =>
    getFromLocalStorage('dm_diplomas', []),
  );

  const [bookFormVisible, setBookFormVisible] = useState(false);
  const [decisionFormVisible, setDecisionFormVisible] = useState(false);
  const [fieldFormVisible, setFieldFormVisible] = useState(false);
  const [diplomaFormVisible, setDiplomaFormVisible] = useState(false);

  const [editingBook, setEditingBook] = useState<DiplomaBook | null>(null);
  const [editingDecision, setEditingDecision] = useState<GraduationDecision | null>(null);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [editingDiploma, setEditingDiploma] = useState<Diploma | null>(null);

  useEffect(() => {
    saveToLocalStorage('dm_books', books);
  }, [books]);

  useEffect(() => {
    saveToLocalStorage('dm_decisions', decisions);
  }, [decisions]);

  useEffect(() => {
    saveToLocalStorage('dm_custom_fields', customFields);
  }, [customFields]);

  useEffect(() => {
    saveToLocalStorage('dm_diplomas', diplomas);
  }, [diplomas]);

  const handleAddBook = (values: any) => {
    const newBook: DiplomaBook = {
      id: Date.now(),
      year: values.year,
      name: values.name,
      currentNumber: 1,
    };
    setBooks([...books, newBook]);
    message.success('Thêm sổ văn bằng thành công');
    setBookFormVisible(false);
  };

  const handleEditBook = (values: any) => {
    if (!editingBook) return;
    setBooks(books.map((b) => (b.id === editingBook.id ? { ...b, ...values } : b)));
    message.success('Cập nhật sổ văn bằng thành công');
    setBookFormVisible(false);
    setEditingBook(null);
  };

  const handleDeleteBook = (id: number) => {
    setBooks(books.filter((b) => b.id !== id));
    message.success('Xóa sổ văn bằng thành công');
  };

  const handleAddDecision = (values: any) => {
    const newDecision: GraduationDecision = {
      id: Date.now(),
      ...values,
      searchCount: 0,
    };
    setDecisions([...decisions, newDecision]);
    message.success('Thêm quyết định thành công');
    setDecisionFormVisible(false);
  };

  const handleEditDecision = (values: any) => {
    if (!editingDecision) return;
    setDecisions(
      decisions.map((d) => (d.id === editingDecision.id ? { ...d, ...values } : d)),
    );
    message.success('Cập nhật quyết định thành công');
    setDecisionFormVisible(false);
    setEditingDecision(null);
  };

  const handleDeleteDecision = (id: number) => {
    setDecisions(decisions.filter((d) => d.id !== id));
    message.success('Xóa quyết định thành công');
  };

  const handleSearch = (decisionId: number) => {
    setDecisions(
      decisions.map((d) =>
        d.id === decisionId ? { ...d, searchCount: d.searchCount + 1 } : d,
      ),
    );
  };

  const handleAddField = (values: any) => {
    const newField: CustomField = {
      id: Date.now(),
      name: values.name,
      type: values.type,
      order: customFields.length + 1,
    };
    setCustomFields([...customFields, newField]);
    message.success('Thêm trường thông tin thành công');
    setFieldFormVisible(false);
  };

  const handleEditField = (values: any) => {
    if (!editingField) return;
    setCustomFields(
      customFields.map((f) => (f.id === editingField.id ? { ...f, ...values } : f)),
    );
    message.success('Cập nhật trường thông tin thành công');
    setFieldFormVisible(false);
    setEditingField(null);
  };

  const handleDeleteField = (id: number) => {
    setCustomFields(customFields.filter((f) => f.id !== id));
    message.success('Xóa trường thông tin thành công');
  };

  const getCurrentBookNumber = (): number => {
    if (books.length === 0) return 1;
    const latestBook = books[books.length - 1];
    const bookDiplomas = diplomas.filter((d) => {
      const decision = decisions.find((dec) => dec.id === d.decisionId);
      return decision && decision.bookId === latestBook.id;
    });
    return bookDiplomas.length + 1;
  };

  const handleAddDiploma = (values: any) => {
    const decision = decisions.find((d) => d.id === values.decisionId);
    if (!decision) {
      message.error('Không tìm thấy quyết định');
      return;
    }

    const book = books.find((b) => b.id === decision.bookId);
    if (!book) {
      message.error('Không tìm thấy sổ văn bằng');
      return;
    }

    const bookDiplomas = diplomas.filter((d) => {
      const dec = decisions.find((de) => de.id === d.decisionId);
      return dec && dec.bookId === book.id;
    });

    const newDiploma: Diploma = {
      id: Date.now(),
      bookNumber: bookDiplomas.length + 1,
      diplomaNumber: values.diplomaNumber,
      studentCode: values.studentCode,
      fullName: values.fullName,
      birthDate: values.birthDate,
      decisionId: values.decisionId,
      customData: values.customData,
    };

    setDiplomas([...diplomas, newDiploma]);
    setBooks(
      books.map((b) =>
        b.id === book.id ? { ...b, currentNumber: b.currentNumber + 1 } : b,
      ),
    );
    message.success('Thêm văn bằng thành công');
    setDiplomaFormVisible(false);
  };

  const handleEditDiploma = (values: any) => {
    if (!editingDiploma) return;
    setDiplomas(
      diplomas.map((d) => (d.id === editingDiploma.id ? { ...d, ...values } : d)),
    );
    message.success('Cập nhật văn bằng thành công');
    setDiplomaFormVisible(false);
    setEditingDiploma(null);
  };

  const handleDeleteDiploma = (id: number) => {
    setDiplomas(diplomas.filter((d) => d.id !== id));
    message.success('Xóa văn bằng thành công');
  };

  const bookColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Năm', dataIndex: 'year', width: 100 },
    { title: 'Tên sổ', dataIndex: 'name' },
    { title: 'Số hiệu hiện tại', dataIndex: 'currentNumber', width: 150 },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: DiplomaBook) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBook(record);
              setBookFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteBook(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const decisionColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Số QĐ', dataIndex: 'decisionNumber', width: 150 },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      width: 120,
      render: (date: string) => formatDate(date),
    },
    { title: 'Trích yếu', dataIndex: 'summary' },
    {
      title: 'Sổ VB',
      dataIndex: 'bookId',
      width: 150,
      render: (id: number) => books.find((b) => b.id === id)?.name || '---',
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'searchCount',
      width: 120,
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: GraduationDecision) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDecision(record);
              setDecisionFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteDecision(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fieldColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên trường', dataIndex: 'name' },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'type',
      width: 150,
      render: (type: string) => <Tag>{getFieldTypeLabel(type)}</Tag>,
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: CustomField) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingField(record);
              setFieldFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteField(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const diplomaColumns = [
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
      title: 'Quyết định',
      dataIndex: 'decisionId',
      width: 150,
      render: (id: number) => decisions.find((d) => d.id === id)?.decisionNumber || '---',
    },
    {
      title: 'Thao tác',
      width: 150,
      render: (_: any, record: Diploma) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDiploma(record);
              setDiplomaFormVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteDiploma(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Quản lý Sổ Văn bằng</h1>

      <Tabs defaultActiveKey="search">
        <TabPane tab="Tra cứu" key="search">
          <SearchDiploma
            diplomas={diplomas}
            decisions={decisions}
            customFields={customFields}
            onSearch={handleSearch}
          />
        </TabPane>

        <TabPane tab="Sổ văn bằng" key="book">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingBook(null);
                  setBookFormVisible(true);
                }}
              >
                Thêm sổ
              </Button>
            }
          >
            <Table rowKey="id" columns={bookColumns} dataSource={books} pagination={false} />
          </Card>
        </TabPane>

        <TabPane tab="Quyết định TN" key="decision">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingDecision(null);
                  setDecisionFormVisible(true);
                }}
              >
                Thêm quyết định
              </Button>
            }
          >
            <Table
              rowKey="id"
              columns={decisionColumns}
              dataSource={decisions}
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Cấu hình biểu mẫu" key="field">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingField(null);
                  setFieldFormVisible(true);
                }}
              >
                Thêm trường
              </Button>
            }
          >
            <Table rowKey="id" columns={fieldColumns} dataSource={customFields} pagination={false} />
          </Card>
        </TabPane>

        <TabPane tab="Thông tin văn bằng" key="diploma">
          <Card
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingDiploma(null);
                  setDiplomaFormVisible(true);
                }}
              >
                Thêm văn bằng
              </Button>
            }
          >
            <Table
              rowKey="id"
              columns={diplomaColumns}
              dataSource={diplomas}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Forms */}
      <DiplomaBookForm
        visible={bookFormVisible}
        onCancel={() => {
          setBookFormVisible(false);
          setEditingBook(null);
        }}
        onSubmit={editingBook ? handleEditBook : handleAddBook}
        initialValues={editingBook}
      />

      <GraduationDecisionForm
        visible={decisionFormVisible}
        onCancel={() => {
          setDecisionFormVisible(false);
          setEditingDecision(null);
        }}
        onSubmit={editingDecision ? handleEditDecision : handleAddDecision}
        initialValues={editingDecision}
        books={books}
      />

      <CustomFieldForm
        visible={fieldFormVisible}
        onCancel={() => {
          setFieldFormVisible(false);
          setEditingField(null);
        }}
        onSubmit={editingField ? handleEditField : handleAddField}
        initialValues={editingField}
      />

      <DiplomaForm
        visible={diplomaFormVisible}
        onCancel={() => {
          setDiplomaFormVisible(false);
          setEditingDiploma(null);
        }}
        onSubmit={editingDiploma ? handleEditDiploma : handleAddDiploma}
        initialValues={editingDiploma}
        decisions={decisions}
        customFields={customFields}
        books={books}
        currentBookNumber={getCurrentBookNumber()}
      />
    </div>
  );
};

export default DiplomaManagement;
