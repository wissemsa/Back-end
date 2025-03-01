import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  AppSubTab,
  UserDoc,
  BlogPostDoc,
  TodoDoc,
  CookieItem,
  SessionData,
  QueryLog,
} from './types';
import {
  loadUsers,
  saveUsers,
  loadPosts,
  savePosts,
  loadTodos,
  saveTodos,
  loadCookies,
  saveCookies,
  loadSession,
  saveSession,
  loadQueryLogs,
  saveQueryLogs,
  loadCurrentUserId,
  saveCurrentUserId,
  resetAllDataToDefault,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { BlogApp } from './components/apps/BlogApp';
import { TodoApp } from './components/apps/TodoApp';
import { MongoVisualizer } from './components/mongo/MongoVisualizer';
import { SessionLab } from './components/session/SessionLab';
import { EjsStudio } from './components/ejs/EjsStudio';
import { CodeExport } from './components/export/CodeExport';
import { BookOpen, CheckSquare, Database, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('apps');
  const [appSubTab, setAppSubTab] = useState<AppSubTab>('blog');

  // Core data states
  const [users, setUsers] = useState<UserDoc[]>(() => loadUsers());
  const [posts, setPosts] = useState<BlogPostDoc[]>(() => loadPosts());
  const [todos, setTodos] = useState<TodoDoc[]>(() => loadTodos());
  const [cookies, setCookies] = useState<CookieItem[]>(() => loadCookies());
  const [session, setSession] = useState<SessionData>(() => loadSession());
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>(() => loadQueryLogs());
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadCurrentUserId());

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Sync state to localStorage
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveCookies(cookies);
  }, [cookies]);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    saveQueryLogs(queryLogs);
  }, [queryLogs]);

  useEffect(() => {
    saveCurrentUserId(currentUserId);
  }, [currentUserId]);

  const currentUser = users.find((u) => u._id === currentUserId) || users[0];

  // User Actions
  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    const target = users.find((u) => u._id === userId);
    showToast(`Switched active session user to @${target?.username || userId}`);
  };

  const handleUpdateUser = (updatedUser: UserDoc) => {
    const updated = users.map((u) => (u._id === updatedUser._id ? updatedUser : u));
    setUsers(updated);
    showToast(`Profile updated for @${updatedUser.username}`);
  };

  const handleAddUser = (newUser: UserDoc) => {
    setUsers((prev) => [newUser, ...prev]);
    showToast(`MongoDB userDB: Inserted user @${newUser.username}`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    showToast(`MongoDB userDB: Removed document _id ${userId}`);
  };

  // Blog Actions
  const handleSavePost = (post: BlogPostDoc) => {
    const existingIndex = posts.findIndex((p) => p._id === post._id);
    if (existingIndex >= 0) {
      const nextPosts = [...posts];
      nextPosts[existingIndex] = post;
      setPosts(nextPosts);
      showToast(`Updated post: "${post.title.substring(0, 30)}..."`);
    } else {
      setPosts([post, ...posts]);
      showToast(`Published post: "${post.title.substring(0, 30)}..." to MongoDB`);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    showToast('Post deleted from MongoDB');
  };

  const handleToggleLike = (postId: string, userId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const hasLiked = p.likes.includes(userId);
        const newLikes = hasLiked
          ? p.likes.filter((id) => id !== userId)
          : [...p.likes, userId];
        return { ...p, likes: newLikes };
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const newComment = {
          _id: 'c_' + Math.random().toString(16).substring(2, 8),
          userId: currentUser._id,
          username: currentUser.username,
          userAvatar: currentUser.avatarUrl,
          content,
          createdAt: new Date().toISOString(),
        };
        return { ...p, comments: [...p.comments, newComment] };
      })
    );
    showToast('Comment saved to post document');
  };

  // Todo Actions
  const handleSaveTodo = (todo: TodoDoc) => {
    const exists = todos.some((t) => t._id === todo._id);
    if (exists) {
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? todo : t)));
      showToast('Task updated in MongoDB');
    } else {
      setTodos((prev) => [todo, ...prev]);
      showToast('Task inserted into MongoDB todos collection');
    }
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos((prev) => prev.filter((t) => t._id !== todoId));
    showToast('Task removed from database');
  };

  const handleToggleTodoStatus = (todoId: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t._id !== todoId) return t;
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return {
          ...t,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
          __v: t.__v + 1,
        };
      })
    );
  };

  const handleClearCompletedTodos = () => {
    const beforeCount = todos.length;
    const remaining = todos.filter((t) => t.status !== 'completed');
    setTodos(remaining);
    showToast(`Removed ${beforeCount - remaining.length} completed tasks`);
  };

  // Session & Cookie Actions
  const handleSetCookie = (newCookie: CookieItem) => {
    setCookies((prev) => {
      const filtered = prev.filter((c) => c.key !== newCookie.key);
      return [newCookie, ...filtered];
    });
    showToast(`Cookie set: ${newCookie.key}`);
  };

  const handleDeleteCookie = (key: string) => {
    setCookies((prev) => prev.filter((c) => c.key !== key));
    showToast(`Cleared cookie: ${key}`);
  };

  const handleUpdateSessionData = (key: string, value: any) => {
    setSession((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [key]: value,
      },
    }));
    showToast(`Assigned req.session.${key}`);
  };

  const handleDestroySession = () => {
    setSession((prev) => ({
      ...prev,
      data: {},
      sessionId: 's%3A' + Math.random().toString(16).substring(2, 14),
    }));
    showToast('req.session.destroy() completed');
  };

  const handleResetSession = () => {
    setSession({
      sessionId: 's%3A7a9b2c3d4e5f6g7h8i9j',
      data: {
        anyExampleNameHere: 'exampleUserData',
        userId: currentUser._id,
        username: currentUser.username,
        role: currentUser.role,
        isLoggedIn: true,
      },
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    });
    showToast('Session state reset to tutorial defaults');
  };

  // Reset database completely
  const handleResetDatabase = () => {
    if (confirm('Reset database, sessions, cookies, and posts to default tutorial state?')) {
      resetAllDataToDefault();
      setUsers(loadUsers());
      setPosts(loadPosts());
      setTodos(loadTodos());
      setCookies(loadCookies());
      setSession(loadSession());
      setQueryLogs([]);
      setCurrentUserId(loadCurrentUserId());
      showToast('Database reset to clean tutorial seeds');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        onResetDatabase={handleResetDatabase}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tab 1: Live Applications (Blog Engine & Todo App) */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            {/* Sub-navigation for projects */}
            <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 w-fit">
              <button
                onClick={() => setAppSubTab('blog')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  appSubTab === 'blog'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>1. Blog Post Engine</span>
              </button>

              <button
                onClick={() => setAppSubTab('todo')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  appSubTab === 'todo'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckSquare className="h-3.5 w-3.5" />
                <span>2. To Do & Workflow App</span>
              </button>
            </div>

            {appSubTab === 'blog' ? (
              <BlogApp
                posts={posts}
                users={users}
                currentUser={currentUser}
                onSavePost={handleSavePost}
                onDeletePost={handleDeletePost}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
                onUpdateUser={handleUpdateUser}
              />
            ) : (
              <TodoApp
                todos={todos}
                currentUser={currentUser}
                onSaveTodo={handleSaveTodo}
                onDeleteTodo={handleDeleteTodo}
                onToggleStatus={handleToggleTodoStatus}
                onClearCompleted={handleClearCompletedTodos}
              />
            )}
          </div>
        )}

        {/* Tab 2: MongoDB & Mongoose Visualizer */}
        {activeTab === 'mongo' && (
          <MongoVisualizer
            users={users}
            posts={posts}
            todos={todos}
            queryLogs={queryLogs}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onLogQuery={(log) => setQueryLogs((prev) => [log, ...prev])}
          />
        )}

        {/* Tab 3: Session & Cookies Lab */}
        {activeTab === 'session' && (
          <SessionLab
            cookies={cookies}
            session={session}
            onSetCookie={handleSetCookie}
            onDeleteCookie={handleDeleteCookie}
            onUpdateSessionData={handleUpdateSessionData}
            onDestroySession={handleDestroySession}
            onResetSession={handleResetSession}
          />
        )}

        {/* Tab 4: EJS & Pipeline Simulator */}
        {activeTab === 'ejs' && <EjsStudio />}

        {/* Tab 5: Export Boilerplate Code */}
        {activeTab === 'export' && <CodeExport />}
      </main>

      {/* Quiet Footer without pseudo-technical clutter */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">NodeForge</span>
            <span aria-hidden="true">·</span>
            <span>Node.js, Express.js, EJS & MongoDB Developer Studio</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Cluster: amazonDB (MongoDB 8.0)</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">Port 3000</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
