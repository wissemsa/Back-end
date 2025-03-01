import React, { useState } from 'react';
import { TodoDoc, UserDoc } from '../../types';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Filter,
  CheckCheck,
  Code,
} from 'lucide-react';

interface TodoAppProps {
  todos: TodoDoc[];
  currentUser: UserDoc;
  onSaveTodo: (todo: TodoDoc) => void;
  onDeleteTodo: (todoId: string) => void;
  onToggleStatus: (todoId: string) => void;
  onClearCompleted: () => void;
}

export const TodoApp: React.FC<TodoAppProps> = ({
  todos,
  currentUser,
  onSaveTodo,
  onDeleteTodo,
  onToggleStatus,
  onClearCompleted,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Backend' | 'Database' | 'DevOps' | 'API'>('Backend');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [lastExecutedQuery, setLastExecutedQuery] = useState<string>(
    "Todo.find({ userId: '65411c6ea1039336d4d364cc' }).sort({ createdAt: -1 })"
  );

  const filteredTodos = todos.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  const completedCount = todos.filter((t) => t.status === 'completed').length;
  const pendingCount = todos.filter((t) => t.status !== 'completed').length;

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTodo: TodoDoc = {
      _id: '6541' + Math.random().toString(16).substring(2, 10) + 'a10393',
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      status: 'pending',
      priority: newPriority,
      category: newCategory,
      userId: currentUser._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    onSaveTodo(newTodo);
    setLastExecutedQuery(`await Todo.create({\n  title: "${newTodo.title}",\n  priority: "${newTodo.priority}",\n  category: "${newTodo.category}"\n})`);
    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Project 2</span>
            <span aria-hidden="true">·</span>
            <span>REST API & Asynchronous CRUD</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">MongoDB / todos</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Task & Pipeline Workflow Manager
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-0.5">
            Full-stack task system demonstrating Mongoose schemas, status pipelines, and instant query execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
            >
              Clear Completed ({completedCount})
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isAdding ? 'Close Form' : 'New Task'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (No pills) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400">Active Tasks</div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">{pendingCount}</div>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400">Completed</div>
          <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">{completedCount}</div>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="text-xs text-slate-400">Total MongoDB Documents</div>
          <div className="text-2xl font-bold text-slate-300 tabular-nums mt-1">{todos.length}</div>
        </div>
      </div>

      {/* Add Task Collapsible Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTodo}
          className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Write integration test for /users/create route"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="API">API</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300">Description (Optional)</label>
              <input
                type="text"
                placeholder="Details, implementation notes, or endpoint URLs..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 rounded-lg"
            >
              Save to Database
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/60 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({todos.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterStatus === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              filterStatus === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-500">Filter:</span>
          {['all', 'Backend', 'Database', 'API', 'DevOps'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-800 text-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-slate-800/60">
            <CheckCheck className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No tasks found</p>
            <p className="text-xs text-slate-500 mt-0.5">Change filters or create a new backend task above.</p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isDone = todo.status === 'completed';
            return (
              <div
                key={todo._id}
                className="flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900/90 rounded-xl border border-slate-800/80 transition-colors group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                  <button
                    onClick={() => {
                      onToggleStatus(todo._id);
                      setLastExecutedQuery(
                        `await Todo.findByIdAndUpdate("${todo._id}", {\n  status: "${
                          isDone ? 'pending' : 'completed'
                        }"\n})`
                      );
                    }}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>

                    {todo.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {todo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{todo.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{todo.priority} priority</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-[10px]">
                        _id: {todo._id.substring(todo._id.length - 6)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onDeleteTodo(todo._id);
                      setLastExecutedQuery(`await Todo.findByIdAndDelete("${todo._id}")`);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100"
                    title="Delete Record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Query Execution Trace */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Code className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Mongoose ODM Query Trace</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">status: 200 OK · db: amazonDB</span>
        </div>
        <pre className="text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed">
          {lastExecutedQuery}
        </pre>
      </div>
    </div>
  );
};
