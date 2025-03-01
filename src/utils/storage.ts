import { UserDoc, BlogPostDoc, TodoDoc, CookieItem, SessionData, QueryLog } from '../types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_TODOS, INITIAL_COOKIES, INITIAL_SESSION } from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'nodeforge_users_v2',
  POSTS: 'nodeforge_posts_v2',
  TODOS: 'nodeforge_todos_v2',
  COOKIES: 'nodeforge_cookies_v2',
  SESSION: 'nodeforge_session_v2',
  QUERY_LOGS: 'nodeforge_query_logs_v2',
  CURRENT_USER: 'nodeforge_current_user_v2',
};

export function loadUsers(): UserDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserDoc[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function loadPosts(): BlogPostDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_POSTS;
  }
}

export function savePosts(posts: BlogPostDoc[]): void {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

export function loadTodos(): TodoDoc[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(INITIAL_TODOS));
      return INITIAL_TODOS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TODOS;
  }
}

export function saveTodos(todos: TodoDoc[]): void {
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
}

export function loadCookies(): CookieItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COOKIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(INITIAL_COOKIES));
      return INITIAL_COOKIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_COOKIES;
  }
}

export function saveCookies(cookies: CookieItem[]): void {
  localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(cookies));
}

export function loadSession(): SessionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(INITIAL_SESSION));
      return INITIAL_SESSION;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSION;
  }
}

export function saveSession(session: SessionData): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function loadQueryLogs(): QueryLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUERY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveQueryLogs(logs: QueryLog[]): void {
  localStorage.setItem(STORAGE_KEYS.QUERY_LOGS, JSON.stringify(logs.slice(0, 50)));
}

export function loadCurrentUserId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return id || INITIAL_USERS[0]._id;
  } catch {
    return INITIAL_USERS[0]._id;
  }
}

export function saveCurrentUserId(id: string): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, id);
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(INITIAL_TODOS));
  localStorage.setItem(STORAGE_KEYS.COOKIES, JSON.stringify(INITIAL_COOKIES));
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(INITIAL_SESSION));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]._id);
  localStorage.setItem(STORAGE_KEYS.QUERY_LOGS, JSON.stringify([]));
}
