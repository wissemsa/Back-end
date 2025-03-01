import React, { useState } from 'react';
import { UserDoc, BlogPostDoc, TodoDoc, QueryLog } from '../../types';
import {
  Database,
  Terminal,
  Play,
  CheckCircle,
  Plus,
  Trash2,
  Search,
  Code,
  Sparkles,
  Server,
  Layers,
  FileCode,
} from 'lucide-react';

interface MongoVisualizerProps {
  users: UserDoc[];
  posts: BlogPostDoc[];
  todos: TodoDoc[];
  queryLogs: QueryLog[];
  onAddUser: (user: UserDoc) => void;
  onDeleteUser: (userId: string) => void;
  onLogQuery: (log: QueryLog) => void;
}

export const MongoVisualizer: React.FC<MongoVisualizerProps> = ({
  users,
  posts,
  todos,
  queryLogs,
  onAddUser,
  onDeleteUser,
  onLogQuery,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<'userdbs' | 'posts' | 'todos'>('userdbs');
  const [queryOperation, setQueryOperation] = useState<'create' | 'find' | 'findOne' | 'findOneAndDelete'>('find');

  // Input states for queries
  const [newUsername, setNewUsername] = useState('wissem');
  const [newName, setNewName] = useState('wissem');
  const [newAge, setNewAge] = useState(20);
  const [findParam, setFindParam] = useState('wissem');

  // Result output display
  const [executionResult, setExecutionResult] = useState<any>(users);
  const [executionTime, setExecutionTime] = useState<number>(3);
  const [activeCodeSnippet, setActiveCodeSnippet] = useState<string>('await userModel.find()');
  const [activeMongoshCmd, setActiveMongoshCmd] = useState<string>('db.userdbs.find()');

  const handleExecuteQuery = () => {
    const startTime = performance.now();

    if (queryOperation === 'create') {
      const generatedId = '6541' + Math.random().toString(16).substring(2, 10) + 'd4d364cc';
      const createdUser: UserDoc = {
        _id: generatedId,
        username: newUsername.trim() || 'user_' + Math.floor(Math.random() * 1000),
        name: newName.trim() || 'New Developer',
        age: Number(newAge) || 21,
        email: `${newUsername.trim() || 'user'}@backend.dev`,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };

      onAddUser(createdUser);
      const res = {
        _id: `ObjectId("${createdUser._id}")`,
        username: createdUser.username,
        name: createdUser.name,
        age: createdUser.age,
        __v: 0,
      };
      setExecutionResult(res);
      const code = `const createdUser = await userModel.create({\n  username: "${createdUser.username}",\n  name: "${createdUser.name}",\n  age: ${createdUser.age}\n});\nres.send(createdUser);`;
      setActiveCodeSnippet(code);
      setActiveMongoshCmd(`db.userdbs.insertOne({\n  username: "${createdUser.username}",\n  name: "${createdUser.name}",\n  age: ${createdUser.age}\n})`);

      const dur = Math.round(performance.now() - startTime) + 2;
      setExecutionTime(dur);
      onLogQuery({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        method: 'userModel.create',
        query: `username: "${createdUser.username}"`,
        durationMs: dur,
        resultSummary: `Created 1 doc with _id ${createdUser._id}`,
        status: 'success',
      });
    } else if (queryOperation === 'find') {
      let resultData: any = [];
      if (selectedCollection === 'userdbs') {
        resultData = users.map((u) => ({
          _id: `ObjectId("${u._id}")`,
          username: u.username,
          name: u.name,
          age: u.age,
          __v: u.__v,
        }));
        setActiveCodeSnippet('let users = await userModel.find();\nres.send(users);');
        setActiveMongoshCmd('db.userdbs.find()');
      } else if (selectedCollection === 'posts') {
        resultData = posts.map((p) => ({
          _id: `ObjectId("${p._id}")`,
          title: p.title,
          category: p.category,
          authorUsername: p.authorUsername,
          likesCount: p.likes.length,
          __v: p.__v,
        }));
        setActiveCodeSnippet('let posts = await postModel.find();\nres.send(posts);');
        setActiveMongoshCmd('db.posts.find()');
      } else {
        resultData = todos.map((t) => ({
          _id: `ObjectId("${t._id}")`,
          title: t.title,
          status: t.status,
          priority: t.priority,
          __v: t.__v,
        }));
        setActiveCodeSnippet('let todos = await todoModel.find();\nres.send(todos);');
        setActiveMongoshCmd('db.todos.find()');
      }

      setExecutionResult(resultData);
      const dur = Math.round(performance.now() - startTime) + 2;
      setExecutionTime(dur);
      onLogQuery({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        method: `${selectedCollection}.find`,
        query: '{}',
        durationMs: dur,
        resultSummary: `Retrieved ${resultData.length} documents`,
        status: 'success',
      });
    } else if (queryOperation === 'findOne') {
      const match = users.find(
        (u) =>
          u.username.toLowerCase() === findParam.toLowerCase() ||
          u._id === findParam
      );
      const formatted = match
        ? {
            _id: `ObjectId("${match._id}")`,
            username: match.username,
            name: match.name,
            age: match.age,
            __v: match.__v,
          }
        : null;

      setExecutionResult(formatted);
      setActiveCodeSnippet(`let user = await userModel.findOne({ username: "${findParam}" });\nres.send(user);`);
      setActiveMongoshCmd(`db.userdbs.findOne({ username: "${findParam}" })`);

      const dur = Math.round(performance.now() - startTime) + 2;
      setExecutionTime(dur);
      onLogQuery({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        method: 'userModel.findOne',
        query: `username: "${findParam}"`,
        durationMs: dur,
        resultSummary: match ? `Found user @${match.username}` : 'null (no match)',
        status: 'success',
      });
    } else if (queryOperation === 'findOneAndDelete') {
      const target = users.find(
        (u) =>
          u.username.toLowerCase() === findParam.toLowerCase() ||
          u._id === findParam
      );

      if (target) {
        onDeleteUser(target._id);
        const res = {
          _id: `ObjectId("${target._id}")`,
          username: target.username,
          name: target.name,
          age: target.age,
          deleted: true,
          __v: target.__v,
        };
        setExecutionResult(res);
      } else {
        setExecutionResult(null);
      }

      setActiveCodeSnippet(`let deletedUser = await userModel.findOneAndDelete({\n  username: "${findParam}"\n});\nres.send(deletedUser);`);
      setActiveMongoshCmd(`db.userdbs.findOneAndDelete({ username: "${findParam}" })`);

      const dur = Math.round(performance.now() - startTime) + 2;
      setExecutionTime(dur);
      onLogQuery({
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        method: 'userModel.findOneAndDelete',
        query: `username: "${findParam}"`,
        durationMs: dur,
        resultSummary: target ? `Deleted document _id: ${target._id}` : 'null (no match to delete)',
        status: 'success',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>MongoDB & Mongoose ODM</span>
          <span aria-hidden="true">·</span>
          <span>amazonDB Cluster</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-400">mongodb://127.0.0.1:27017/amazonDB</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">
          MongoDB Architecture & Live Query Engine
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-0.5">
          Execute asynchronous Mongoose queries with live database inspection. Understand DB Formation, Collections, and Document Schemas.
        </p>
      </div>

      {/* Conceptual Map (Code Side -> MongoDB Side) */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
        <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span>Architecture Mapping: Code Side ⟶ MongoDB Side Action</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-slate-400 font-medium">1. DB Setup ⟶ DB Formation</div>
            <div className="font-mono text-emerald-400 text-[11px]">
              mongoose.connect("mongodb://127.0.0.1:27017/amazonDB")
            </div>
            <p className="text-slate-500 text-[11px] pt-1">
              Creates the database named <code className="text-slate-300">amazonDB</code> on local server.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-slate-400 font-medium">2. Model ⟶ Collection</div>
            <div className="font-mono text-emerald-400 text-[11px]">
              module.exports = mongoose.model("userDB", userSchema)
            </div>
            <p className="text-slate-500 text-[11px] pt-1">
              Creates collection <code className="text-slate-300">userdbs</code> inside amazonDB.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <div className="text-slate-400 font-medium">3. Schema ⟶ Documents</div>
            <div className="font-mono text-emerald-400 text-[11px]">
              {'{ username: String, name: String, age: Number }'}
            </div>
            <p className="text-slate-500 text-[11px] pt-1">
              Validates and structures each individual document record.
            </p>
          </div>
        </div>
      </div>

      {/* Query Runner & Document Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Query Runner Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Live Query Console</h3>
              </div>
              <span className="font-mono text-[11px] text-slate-400">amazonDB.userdbs</span>
            </div>

            {/* Target Collection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Target Collection</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedCollection('userdbs')}
                  className={`py-1 rounded text-center transition-colors ${
                    selectedCollection === 'userdbs'
                      ? 'bg-slate-800 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  userdbs ({users.length})
                </button>
                <button
                  onClick={() => setSelectedCollection('posts')}
                  className={`py-1 rounded text-center transition-colors ${
                    selectedCollection === 'posts'
                      ? 'bg-slate-800 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  posts ({posts.length})
                </button>
                <button
                  onClick={() => setSelectedCollection('todos')}
                  className={`py-1 rounded text-center transition-colors ${
                    selectedCollection === 'todos'
                      ? 'bg-slate-800 text-emerald-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  todos ({todos.length})
                </button>
              </div>
            </div>

            {/* Operation Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Mongoose Operation</label>
              <select
                value={queryOperation}
                onChange={(e) => setQueryOperation(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="find">.find() — Retrieve All Documents</option>
                <option value="create">.create(...) — Insert New Document (Tutorial Schema)</option>
                <option value="findOne">.findOne({'{ username: ... }'}) — Find Single Document</option>
                <option value="findOneAndDelete">.findOneAndDelete({'{ username: ... }'}) — Delete Record</option>
              </select>
            </div>

            {/* Dynamic Inputs depending on operation */}
            {queryOperation === 'create' && (
              <div className="space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400">Document Fields (userSchema)</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-400">username: String</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="wissem"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 font-mono mt-0.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">name: String</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="wissem"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 font-mono mt-0.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400">age: Number</label>
                    <input
                      type="number"
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      placeholder="20"
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 font-mono mt-0.5 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {(queryOperation === 'findOne' || queryOperation === 'findOneAndDelete') && (
              <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <label className="text-[11px] font-medium text-slate-300">
                  Target Username or ObjectId to {queryOperation === 'findOne' ? 'locate' : 'remove'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={findParam}
                    onChange={(e) => setFindParam(e.target.value)}
                    placeholder="wissem"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFindParam('wissem')}
                    className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                  >
                    Preset "wissem"
                  </button>
                </div>
              </div>
            )}

            {/* Execute Button */}
            <button
              onClick={handleExecuteQuery}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>Execute Asynchronous Query</span>
            </button>
          </div>

          {/* Terminal Command equivalent */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Terminal Equivalent (mongosh)</span>
              <span className="font-mono text-[11px] text-emerald-400">port 27017</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 overflow-x-auto">
              $ mongosh{'\n'}&gt; use amazonDB{'\n'}&gt; {activeMongoshCmd}
            </pre>
          </div>
        </div>

        {/* Right: Output & Active Collection Documents */}
        <div className="lg:col-span-7 space-y-4">
          {/* Query Output Box */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">Express Route Response (res.send)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span className="text-emerald-400">HTTP 200 OK</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{executionTime}ms latency</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">Node.js Code Executed:</div>
              <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400/90 whitespace-pre-wrap">
                {activeCodeSnippet}
              </pre>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">JSON Returned to Client:</div>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 max-h-56 overflow-y-auto leading-relaxed">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          </div>

          {/* Collection Explorer */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">
                  Collection: <span className="font-mono text-emerald-400">{selectedCollection}</span>
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {selectedCollection === 'userdbs'
                  ? users.length
                  : selectedCollection === 'posts'
                  ? posts.length
                  : todos.length}{' '}
                documents
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedCollection === 'userdbs' &&
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">@{user.username}</span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          _id: {user._id}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        name: <span className="text-slate-300">"{user.name}"</span> · age:{' '}
                        <span className="text-emerald-400 tabular-nums">{user.age}</span> · role:{' '}
                        <span className="text-slate-300">{user.role}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteUser(user._id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900"
                      title="Delete Document"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

              {selectedCollection === 'posts' &&
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-200 truncate pr-2">
                        {post.title}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 shrink-0">
                        {post.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>author: @{post.authorUsername}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{post.likes.length} likes</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[10px]">_id: {post._id}</span>
                    </div>
                  </div>
                ))}

              {selectedCollection === 'todos' &&
                todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-slate-200">{todo.title}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{todo.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{todo.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{todo.priority} priority</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[10px]">_id: {todo._id}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
