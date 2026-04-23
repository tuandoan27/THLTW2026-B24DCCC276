import { Avatar, Badge, Button, Card, Col, Empty, Input, message, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Tag, Tabs, Typography } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, DeleteOutlined, EditOutlined, EyeOutlined, GithubOutlined, MailOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Post, PostStatus, Tag as TagType } from './types';
import PostForm from './components/PostForm';
import TagForm from './components/TagForm';
import { AUTHOR, formatDate, getFromLocalStorage, INITIAL_POSTS, INITIAL_TAGS, saveToLocalStorage } from './utils';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const PAGE_SIZE = 9;

const renderMarkdown = (text: string) =>
  text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre style="background:#f5f5f5;padding:12px;border-radius:6px"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:#f5f5f5;padding:2px 5px;border-radius:3px">$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '<br/><br/>');

const PersonalBlog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => getFromLocalStorage('blog_posts', INITIAL_POSTS));
  const [tags, setTags] = useState<TagType[]>(() => getFromLocalStorage('blog_tags', INITIAL_TAGS));

  const [activeTab, setActiveTab] = useState('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // home
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // manage posts
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditPost, setIsEditPost] = useState(false);
  const [manageSearch, setManageSearch] = useState('');
  const [manageStatus, setManageStatus] = useState<PostStatus | 'all'>('all');

  // manage tags
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [isEditTag, setIsEditTag] = useState(false);

  useEffect(() => { saveToLocalStorage('blog_posts', posts); }, [posts]);
  useEffect(() => { saveToLocalStorage('blog_tags', tags); }, [tags]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const getTagById = (id: number) => tags.find((t) => t.id === id);

  const publishedPosts = posts.filter((p) => p.status === 'published');

  const filteredHomePosts = publishedPosts.filter((p) => {
    const matchSearch = !debouncedSearch || p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.summary.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchTag = selectedTag === null || p.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const pagedPosts = filteredHomePosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filteredManagePosts = posts.filter((p) => {
    const matchSearch = !manageSearch || p.title.toLowerCase().includes(manageSearch.toLowerCase());
    const matchStatus = manageStatus === 'all' || p.status === manageStatus;
    return matchSearch && matchStatus;
  });

  const openDetail = (post: Post) => {
    const updated = { ...post, viewCount: post.viewCount + 1 };
    setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    setSelectedPost(updated);
    setActiveTab('detail');
  };

  const handleAddPost = (values: any) => {
    const newPost: Post = { id: Date.now(), ...values, tags: values.tags || [], author: AUTHOR.name, createdAt: new Date().toISOString(), viewCount: 0 };
    setPosts((prev) => [newPost, ...prev]);
    message.success('Thêm bài viết thành công');
    setPostModalVisible(false);
  };

  const handleEditPost = (values: any) => {
    if (!editingPost) return;
    setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? { ...p, ...values, tags: values.tags || [] } : p)));
    message.success('Cập nhật thành công');
    setPostModalVisible(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    message.success('Đã xóa bài viết');
  };

  const handleAddTag = (values: any) => {
    if (tags.some((t) => t.name.toLowerCase() === values.name.toLowerCase())) {
      message.error('Tên thẻ đã tồn tại!');
      return;
    }
    setTags((prev) => [...prev, { id: Date.now(), ...values }]);
    message.success('Thêm thẻ thành công');
    setTagModalVisible(false);
  };

  const handleEditTag = (values: any) => {
    if (!editingTag) return;
    setTags((prev) => prev.map((t) => (t.id === editingTag.id ? { ...t, ...values } : t)));
    message.success('Cập nhật thành công');
    setTagModalVisible(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (id: number) => {
    if (posts.some((p) => p.tags.includes(id))) {
      message.warning('Thẻ đang được dùng trong bài viết!');
      return;
    }
    setTags((prev) => prev.filter((t) => t.id !== id));
    message.success('Đã xóa thẻ');
  };

  const relatedPosts = selectedPost
    ? publishedPosts.filter((p) => p.id !== selectedPost.id && p.tags.some((t) => selectedPost.tags.includes(t))).slice(0, 3)
    : [];

  const postColumns = [
    {
      title: 'Tiêu đề', dataIndex: 'title', ellipsis: true,
      render: (text: string, record: Post) => <a onClick={() => openDetail(record)}>{text}</a>,
    },
    {
      title: 'Trạng thái', dataIndex: 'status', width: 120,
      render: (status: PostStatus) => status === 'published' ? <Badge status="success" text="Đã đăng" /> : <Badge status="default" text="Nháp" />,
    },
    {
      title: 'Thẻ', dataIndex: 'tags', width: 160,
      render: (tagIds: number[]) => tagIds.slice(0, 2).map((id) => { const t = getTagById(id); return t ? <Tag key={id} color={t.color}>{t.name}</Tag> : null; }),
    },
    {
      title: 'Lượt xem', dataIndex: 'viewCount', width: 100,
      render: (count: number) => <><EyeOutlined /> {count}</>,
    },
    {
      title: 'Ngày tạo', dataIndex: 'createdAt', width: 120,
      render: (d: string) => formatDate(d),
    },
    {
      title: 'Thao tác', width: 100,
      render: (_: any, record: Post) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingPost(record); setIsEditPost(true); setPostModalVisible(true); }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDeletePost(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tagColumns = [
    { title: 'STT', width: 60, render: (_: any, __: any, i: number) => i + 1 },
    { title: 'Tên thẻ', dataIndex: 'name', render: (name: string, record: TagType) => <Tag color={record.color}>{name}</Tag> },
    { title: 'Màu', dataIndex: 'color' },
    {
      title: 'Số bài viết', width: 120,
      render: (_: any, record: TagType) => {
        const count = posts.filter((p) => p.tags.includes(record.id)).length;
        return <Badge count={count} showZero style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }} />;
      },
    },
    {
      title: 'Thao tác', width: 100,
      render: (_: any, record: TagType) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setEditingTag(record); setIsEditTag(true); setTagModalVisible(true); }} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDeleteTag(record.id)} okText="Xóa" cancelText="Hủy">
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Personal Blog</h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>

        {/* TRANG CHỦ */}
        <TabPane tab="Trang chủ" key="home">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm bài viết..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 400, marginBottom: 16 }}
          />

          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ marginRight: 8 }}>Lọc theo thẻ:</Text>
            <Tag style={{ cursor: 'pointer' }} color={selectedTag === null ? 'blue' : 'default'} onClick={() => { setSelectedTag(null); setCurrentPage(1); }}>Tất cả</Tag>
            {tags.map((tag) => (
              <Tag key={tag.id} color={selectedTag === tag.id ? tag.color : 'default'} style={{ cursor: 'pointer' }} onClick={() => { setSelectedTag(selectedTag === tag.id ? null : tag.id); setCurrentPage(1); }}>
                {tag.name}
              </Tag>
            ))}
          </div>

          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Tìm thấy <strong>{filteredHomePosts.length}</strong> bài viết
          </Text>

          {pagedPosts.length === 0 ? <Empty description="Không tìm thấy bài viết nào" /> : (
            <Row gutter={[16, 16]}>
              {pagedPosts.map((post) => (
                <Col xs={24} sm={12} lg={8} key={post.id}>
                  <Card
                    hoverable
                    cover={<img alt={post.title} src={post.thumbnail} style={{ height: 160, objectFit: 'cover' }} />}
                    onClick={() => openDetail(post)}
                  >
                    <div style={{ marginBottom: 8 }}>
                      {post.tags.map((tagId) => { const t = getTagById(tagId); return t ? <Tag key={tagId} color={t.color} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setSelectedTag(tagId); setCurrentPage(1); }}>{t.name}</Tag> : null; })}
                    </div>
                    <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>{post.title}</Title>
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 13 }}>{post.summary}</Paragraph>
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                      <Space wrap>
                        <Text type="secondary" style={{ fontSize: 12 }}><UserOutlined /> {post.author}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}><CalendarOutlined /> {formatDate(post.createdAt)}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}><EyeOutlined /> {post.viewCount}</Text>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {filteredHomePosts.length > PAGE_SIZE && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination current={currentPage} pageSize={PAGE_SIZE} total={filteredHomePosts.length} onChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }} showSizeChanger={false} showTotal={(total) => `Tổng ${total} bài viết`} />
            </div>
          )}
        </TabPane>

        {/* CHI TIẾT */}
        <TabPane tab="Chi tiết bài viết" key="detail" disabled={!selectedPost}>
          {selectedPost && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }} onClick={() => { setActiveTab('home'); setSelectedPost(null); }}>Quay lại</Button>

              <img src={selectedPost.thumbnail} alt={selectedPost.title} style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />

              <div style={{ marginBottom: 12 }}>
                {selectedPost.tags.map((tagId) => { const t = getTagById(tagId); return t ? <Tag key={tagId} color={t.color}>{t.name}</Tag> : null; })}
              </div>

              <Title level={2}>{selectedPost.title}</Title>

              <Space style={{ marginBottom: 16 }} wrap>
                <Text type="secondary"><UserOutlined /> {selectedPost.author}</Text>
                <Text type="secondary"><CalendarOutlined /> {formatDate(selectedPost.createdAt)}</Text>
                <Text type="secondary"><EyeOutlined /> {selectedPost.viewCount} lượt xem</Text>
              </Space>

              <hr />

              <div style={{ lineHeight: 1.8, fontSize: 15, marginTop: 16 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedPost.content) }} />

              <hr />

              <Card style={{ margin: '16px 0 24px', background: '#fafafa' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{AUTHOR.name}</Title>
                    <Text type="secondary">{AUTHOR.bio}</Text>
                  </div>
                </div>
              </Card>

              {relatedPosts.length > 0 && (
                <>
                  <Title level={4}>Bài viết liên quan</Title>
                  <Row gutter={[12, 12]}>
                    {relatedPosts.map((related) => (
                      <Col xs={24} sm={8} key={related.id}>
                        <Card hoverable size="small" cover={<img src={related.thumbnail} alt={related.title} style={{ height: 100, objectFit: 'cover' }} />} onClick={() => openDetail(related)}>
                          <Card.Meta title={<span style={{ fontSize: 13 }}>{related.title}</span>} description={<Text type="secondary" style={{ fontSize: 12 }}><CalendarOutlined /> {formatDate(related.createdAt)}</Text>} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </div>
          )}
        </TabPane>

        {/* GIỚI THIỆU */}
        <TabPane tab="Giới thiệu" key="about">
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <Card style={{ marginBottom: 24, textAlign: 'center' }}>
              <Avatar size={100} style={{ marginBottom: 12, border: '3px solid #1890ff' }} />
              <Title level={3} style={{ marginBottom: 4 }}>{AUTHOR.name}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>Sinh viên RIPT</Text>
              <Paragraph style={{ maxWidth: 420, margin: '0 auto 16px' }}>{AUTHOR.bio}</Paragraph>
              <Space>
                {AUTHOR.social.github && <Button shape="circle" icon={<GithubOutlined />} href={AUTHOR.social.github} target="_blank" />}
              </Space>
            </Card>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card style={{ textAlign: 'center', background: '#e6f7ff' }}>
                  <Title level={2} style={{ color: '#1890ff', margin: 0 }}>{posts.filter((p) => p.status === 'published').length}</Title>
                  <Text type="secondary">Bài đã đăng</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ textAlign: 'center', background: '#f6ffed' }}>
                  <Title level={2} style={{ color: '#52c41a', margin: 0 }}>{posts.reduce((s, p) => s + p.viewCount, 0)}</Title>
                  <Text type="secondary">Tổng lượt xem</Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card style={{ textAlign: 'center', background: '#fff7e6' }}>
                  <Title level={2} style={{ color: '#fa8c16', margin: 0 }}>{AUTHOR.skills.length}</Title>
                  <Text type="secondary">Kỹ năng</Text>
                </Card>
              </Col>
            </Row>

            <Card title="Kỹ năng">
              {AUTHOR.skills.map((skill, i) => (
                <Tag key={skill} color={['blue', 'green', 'orange', 'purple', 'cyan', 'red'][i % 6]} style={{ marginBottom: 8, padding: '3px 10px' }}>{skill}</Tag>
              ))}
            </Card>
          </div>
        </TabPane>

        {/* QUẢN LÝ BÀI VIẾT */}
        <TabPane tab="Quản lý bài viết" key="manage-posts">
          <Card extra={
            <Space>
              <Input prefix={<SearchOutlined />} placeholder="Tìm theo tiêu đề..." value={manageSearch} onChange={(e) => setManageSearch(e.target.value)} allowClear style={{ width: 200 }} />
              <Select value={manageStatus} onChange={setManageStatus} style={{ width: 160 }} options={[{ value: 'all', label: 'Tất cả' }, { value: 'published', label: 'Đã đăng' }, { value: 'draft', label: 'Nháp' }]} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPost(null); setIsEditPost(false); setPostModalVisible(true); }}>Thêm bài viết</Button>
            </Space>
          }>
            <Table rowKey="id" columns={postColumns} dataSource={filteredManagePosts} pagination={{ pageSize: 10 }} scroll={{ x: 800 }} />
          </Card>
        </TabPane>

        {/* QUẢN LÝ THẺ */}
        <TabPane tab="Quản lý thẻ" key="manage-tags">
          <Card extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingTag(null); setIsEditTag(false); setTagModalVisible(true); }}>Thêm thẻ</Button>}>
            <Table rowKey="id" columns={tagColumns} dataSource={tags} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
      </Tabs>

      <Modal title={isEditPost ? 'Sửa bài viết' : 'Thêm bài viết'} visible={postModalVisible} footer={null} onCancel={() => { setPostModalVisible(false); setEditingPost(null); }} width={680} destroyOnClose>
        <PostForm post={editingPost} tags={tags} isEdit={isEditPost} onSubmit={isEditPost ? handleEditPost : handleAddPost} onCancel={() => { setPostModalVisible(false); setEditingPost(null); }} />
      </Modal>

      <Modal title={isEditTag ? 'Sửa thẻ' : 'Thêm thẻ'} visible={tagModalVisible} footer={null} onCancel={() => { setTagModalVisible(false); setEditingTag(null); }} width={380} destroyOnClose>
        <TagForm tag={editingTag} isEdit={isEditTag} onSubmit={isEditTag ? handleEditTag : handleAddTag} onCancel={() => { setTagModalVisible(false); setEditingTag(null); }} />
      </Modal>
    </div>
  );
};

export default PersonalBlog;