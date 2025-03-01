export interface UserDoc {
  _id: string;
  username: string;
  name: string;
  age: number;
  email: string;
  bio?: string;
  avatarUrl?: string;
  role: 'admin' | 'author' | 'user';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogPostDoc {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Backend' | 'Node.js' | 'Express' | 'MongoDB' | 'Architecture';
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  coverImage?: string;
  likes: string[]; // user IDs who liked
  comments: BlogComment[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogComment {
  _id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface TodoDoc {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'Backend' | 'Database' | 'DevOps' | 'API';
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CookieItem {
  key: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  maxAge?: number;
  createdAt: string;
}

export interface SessionData {
  sessionId: string;
  data: Record<string, any>;
  expiresAt: string;
  createdAt: string;
}

export interface QueryLog {
  id: string;
  timestamp: string;
  query: string;
  method: string;
  durationMs: number;
  resultSummary: string;
  status: 'success' | 'error';
}

export type ActiveTab = 'apps' | 'mongo' | 'session' | 'ejs' | 'export';
export type AppSubTab = 'blog' | 'todo';
