import React, { useState } from 'react';
import {
  Code,
  FileCode,
  Play,
  Layers,
  Terminal,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const EjsStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'compiler' | 'pipeline' | 'guide'>('compiler');

  // EJS Compiler states
  const [ejsTemplate, setEjsTemplate] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>EJS Template Preview</title>
    <style>
      body { font-family: sans-serif; background: #0b1120; color: #f1f5f9; padding: 20px; }
      .badge { background: #064e3b; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
      .card { background: #1e293b; padding: 14px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #334155; }
    </style>
</head>
<body>
    <h1>Welcome, <%= user.name %>!</h1>
    <p>Age: <strong><%= user.age %></strong> <span class="badge"><%= user.role %></span></p>

    <% if (user.age >= 18) { %>
      <p style="color: #10b981;">✓ Eligible for Certified Backend Developer credential</p>
    <% } else { %>
      <p style="color: #f59e0b;">Junior apprentice status</p>
    <% } %>

    <h3>Published Articles:</h3>
    <% posts.forEach(function(post) { %>
      <div class="card">
        <strong><%= post.title %></strong>
        <p style="font-size: 13px; color: #94a3b8; margin: 4px 0 0 0;"><%= post.summary %></p>
      </div>
    <% }); %>
</body>
</html>`);

  const [ejsDataJson, setEjsDataJson] = useState<string>(`{
  "user": {
    "name": "wissem",
    "username": "wissem",
    "age": 20,
    "role": "admin"
  },
  "posts": [
    {
      "title": "A to Z Guide to Node.js & Express Architecture",
      "summary": "Full overview of middleware, schemas and async operations."
    },
    {
      "title": "Deep Dive: Sessions, Cookies and Stateful Auth",
      "summary": "Understanding express-session, connect.sid and cookie-parser."
    }
  ]
}`);

  const [compiledHtml, setCompiledHtml] = useState<string>('');
  const [compileError, setCompileError] = useState<string | null>(null);

  const handleCompileEjs = () => {
    try {
      setCompileError(null);
      const parsedData = JSON.parse(ejsDataJson);

      // Lightweight client-side EJS simulation:
      let output = ejsTemplate;

      // Replace <%= user.name %>
      output = output.replace(/<%=\s*user\.name\s*%>/g, parsedData.user?.name || '');
      output = output.replace(/<%=\s*user\.username\s*%>/g, parsedData.user?.username || '');
      output = output.replace(/<%=\s*user\.age\s*%>/g, String(parsedData.user?.age || ''));
      output = output.replace(/<%=\s*user\.role\s*%>/g, parsedData.user?.role || '');

      // Evaluate simple if condition
      const isAdult = (parsedData.user?.age || 0) >= 18;
      if (isAdult) {
        output = output.replace(
          /<%\s*if\s*\([^)]+\)\s*\{%>\s*([\s\S]*?)\s*<%\s*\}\s*else\s*\{%>\s*[\s\S]*?\s*<%\s*\}%>/g,
          '$1'
        );
      } else {
        output = output.replace(
          /<%\s*if\s*\([^)]+\)\s*\{%>\s*[\s\S]*?\s*<%\s*\}\s*else\s*\{%>\s*([\s\S]*?)\s*<%\s*\}%>/g,
          '$1'
        );
      }

      // Loop posts
      const loopMatch = output.match(/<%\s*posts\.forEach\(function\(post\)\s*\{%>\s*([\s\S]*?)\s*<%\s*\}\);\s*%>/);
      if (loopMatch && parsedData.posts) {
        const itemTemplate = loopMatch[1];
        const repeated = parsedData.posts
          .map((post: any) => {
            return itemTemplate
              .replace(/<%=\s*post\.title\s*%>/g, post.title)
              .replace(/<%=\s*post\.summary\s*%>/g, post.summary);
          })
          .join('\n');
        output = output.replace(loopMatch[0], repeated);
      }

      setCompiledHtml(output);
    } catch (err: any) {
      setCompileError(err.message || 'JSON or EJS Parsing Error');
    }
  };

  // Compile on initial mount
  React.useEffect(() => {
    handleCompileEjs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Server-Side Rendering & Middleware</span>
          <span aria-hidden="true">·</span>
          <span>EJS Template Engine</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-400">res.render('index', data)</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">
          EJS Studio & Express Request Pipeline
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-0.5">
          Simulate how Express renders dynamic HTML templates using EJS tags (<code className="text-emerald-400 font-mono">&lt;%= %&gt;</code> and <code className="text-emerald-400 font-mono">&lt;% %&gt;</code>) and trace the full HTTP middleware pipeline.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 text-xs w-fit">
        <button
          onClick={() => setActiveSubTab('compiler')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'compiler' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          EJS Template Compiler
        </button>
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'pipeline' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Express Middleware Pipeline
        </button>
        <button
          onClick={() => setActiveSubTab('guide')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            activeSubTab === 'guide' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Generator & CLI Cheat Sheet
        </button>
      </div>

      {/* Compiler Tab */}
      {activeSubTab === 'compiler' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Template input */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <FileCode className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold">views/index.ejs (Template)</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">app.set("view engine", "ejs")</span>
              </div>
              <textarea
                rows={12}
                value={ejsTemplate}
                onChange={(e) => setEjsTemplate(e.target.value)}
                className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Context Data input */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Code className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold">Route Context Data (Passed to res.render)</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">res.render('index', data)</span>
              </div>
              <textarea
                rows={12}
                value={ejsDataJson}
                onChange={(e) => setEjsDataJson(e.target.value)}
                className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300/90 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            {compileError ? (
              <span className="text-xs text-rose-400 font-mono">{compileError}</span>
            ) : (
              <span className="text-xs text-emerald-400 font-mono">Template syntax valid</span>
            )}
            <button
              onClick={handleCompileEjs}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-slate-950" />
              <span>Compile & Render Output</span>
            </button>
          </div>

          {/* Compiled Output View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Raw HTML Sent to Browser</div>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 max-h-64 overflow-y-auto leading-relaxed">
                {compiledHtml}
              </pre>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300">Browser Rendered View (DOM)</div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 h-64 overflow-y-auto">
                <iframe
                  title="EJS Sandbox Preview"
                  srcDoc={compiledHtml}
                  className="w-full h-full border-0 rounded"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Tab */}
      {activeSubTab === 'pipeline' && (
        <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Express.js Request / Response Lifecycle</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every request entering an Express server passes sequentially through mounted middleware until a route handler sends a response.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: '01',
                name: 'Incoming HTTP Request',
                desc: 'Client initiates GET /checkSession with headers (Cookie, User-Agent, Accept).',
                code: 'GET /checkSession HTTP/1.1\nHost: localhost:3000\nCookie: connect.sid=s%3A7a9b...',
              },
              {
                step: '02',
                name: 'Morgan Logger Middleware',
                desc: 'Logs incoming request method, path, and duration to standard output.',
                code: "app.use(logger('dev'));",
              },
              {
                step: '03',
                name: 'Body Parsers (express.json & urlencoded)',
                desc: 'Parses incoming JSON or URL-encoded form bodies and populates req.body.',
                code: 'app.use(express.json());\napp.use(express.urlencoded({ extended: false }));',
              },
              {
                step: '04',
                name: 'Cookie Parser (cookie-parser)',
                desc: 'Parses Cookie header string into a JavaScript dictionary on req.cookies.',
                code: 'app.use(cookieParser()); // => req.cookies',
              },
              {
                step: '05',
                name: 'Session Middleware (express-session)',
                desc: 'Verifies the cryptographic cookie signature, loads session store, and attaches req.session.',
                code: "app.use(session({ secret: 'your-secret-key-here', resave: false, saveUninitialized: false }));",
              },
              {
                step: '06',
                name: 'Static Asset Server (express.static)',
                desc: 'Serves static CSS stylesheets, images, and client scripts from ./public.',
                code: "app.use(express.static(path.join(__dirname, 'public')));",
              },
              {
                step: '07',
                name: 'Route Handlers (Router)',
                desc: 'Matches requested URL and executes controller code (CRUD, database, or rendering).',
                code: "router.get('/allUser', async (req, res) => {\n  let users = await userModel.find();\n  res.send(users);\n});",
              },
            ].map((m) => (
              <div
                key={m.step}
                className="flex flex-col sm:flex-row items-start gap-4 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80"
              >
                <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                  Step {m.step}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-slate-200">{m.name}</div>
                  <p className="text-xs text-slate-400">{m.desc}</p>
                </div>
                <pre className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-2 rounded-lg border border-slate-800 max-w-sm w-full overflow-x-auto">
                  {m.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide & CLI Cheat Sheet */}
      {activeSubTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* CLI Commands */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>Essential Terminal Commands</span>
            </div>

            <div className="space-y-2 font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <div className="text-slate-500"># 1. Initialize & Install Dependencies</div>
                <div className="text-emerald-400 mt-1">npm init -y</div>
                <div className="text-emerald-400">npm install express ejs mongoose express-session cookie-parser morgan http-errors</div>
                <div className="text-emerald-400">npm install -D nodemon</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <div className="text-slate-500"># 2. Or using Express Generator</div>
                <div className="text-emerald-400 mt-1">npm install -g express-generator</div>
                <div className="text-emerald-400">express --view=ejs myapp</div>
                <div className="text-emerald-400">cd myapp && npm install</div>
                <div className="text-emerald-400">npx nodemon</div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <div className="text-slate-500"># 3. MongoDB Server & Shell</div>
                <div className="text-emerald-400 mt-1">mongod</div>
                <div className="text-emerald-400">mongosh</div>
                <div className="text-slate-400">&gt; show dbs</div>
                <div className="text-slate-400">&gt; use amazonDB</div>
                <div className="text-slate-400">&gt; show collections</div>
                <div className="text-slate-400">&gt; db.userdbs.find()</div>
              </div>
            </div>
          </div>

          {/* Key Conceptual Rules */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>Key Differences & Architectural Rules</span>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-400">1. app.get vs router.get</span>
                <p className="text-slate-400">
                  When starting, routes sit directly on <code className="text-slate-200">app.get('/')</code>. In modular Express apps, routes move to <code className="text-slate-200">routes/index.js</code> using <code className="text-slate-200">router = express.Router()</code> and <code className="text-slate-200">module.exports = router</code>.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-400">2. Asynchronous Mongoose Calls</span>
                <p className="text-slate-400">
                  All Mongoose model methods (<code className="text-slate-200">.create()</code>, <code className="text-slate-200">.find()</code>, <code className="text-slate-200">.findOneAndDelete()</code>) return promises. Always declare your route handler <code className="text-slate-200">async (req, res)</code> and <code className="text-slate-200">await</code> queries.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="font-semibold text-emerald-400">3. Session Secret & Security</span>
                <p className="text-slate-400">
                  <code className="text-slate-200">secret</code> signs session ID cookies so users cannot forge them. Set <code className="text-slate-200">resave: false</code> to save storage IO, and <code className="text-slate-200">saveUninitialized: false</code> to comply with cookie consent laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
