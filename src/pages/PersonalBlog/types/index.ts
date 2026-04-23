export type PostStatus = 'draft' | 'published';

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  tags: number[];
  status: PostStatus;
  author: string;
  createdAt: string;
  viewCount: number;
}