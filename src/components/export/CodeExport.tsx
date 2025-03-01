import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileCode,
  Download,
  FolderTree,
  Terminal,
} from 'lucide-react';

export const CodeExport: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('app.js');
  const [copied, setCopied] = useState(false);

  const FILE_CONTENTS: Record<string, { lang: string; content: string }> = {
    'app.js': {
      lang: 'javascript',
      content: `var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
  secret: 'your-secret-key-here', // Cryptographically signs session ID cookie
  resave: false,                 // Don't save session if unmodified
  saveUninitialized: false       // Don't create session until something stored
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;`,
    },
    'routes/index.js': {
      lang: 'javascript',
      content: `var express = require('express');
var router = express.Router();
const userModel = require('./users');

/* GET home page */
router.get('/', function(req, res, next) {
  // Store session and cookie on visit
  req.session.anyExampleNameHere = 'exampleUserData';
  res.cookie('nameHere', 'valueHere');

  res.render('index', { title: 'Backend Masterclass' });
});

/* CREATE user in MongoDB */
router.get('/create', async function(req, res) {
  try {
    const createdUser = await userModel.create({
      username: 'wissem',
      name: 'wissem',
      age: 20
    });
    res.send(createdUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* READ all users from MongoDB */
router.get('/allUser', async function(req, res) {
  try {
    let users = await userModel.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* READ single user by username */
router.get('/singleUser', async function(req, res) {
  try {
    let user = await userModel.findOne({ username: 'wissem' });
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* DELETE user from MongoDB */
router.get('/delete', async function(req, res) {
  try {
    let deletedUser = await userModel.findOneAndDelete({ username: 'wissem' });
    res.send(deletedUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/* CHECK Session */
router.get('/checkSession', function(req, res) {
  if (req.session.anyExampleNameHere === 'exampleUserData') {
    console.log(req.session);
    res.send('Session saved. see on your console/terminal');
  } else {
    res.send('Session data is not available or deleted');
  }
});

/* REMOVE / DESTROY Session */
router.get('/removeSession', function(req, res) {
  req.session.destroy(function(err) {
    if (err) throw err;
    res.send('session deleted');
  });
});

/* CHECK Cookie */
router.get('/checkCookie', function(req, res) {
  console.log(req.cookies);
  res.send('check console/terminal for cookie');
});

/* DELETE Cookie */
router.get('/deleteCookie', function(req, res) {
  res.clearCookie('nameHere');
  res.send('cleared cookie');
});

module.exports = router;`,
    },
    'routes/users.js': {
      lang: 'javascript',
      content: `const mongoose = require('mongoose');

// Connect to MongoDB server (amazonDB)
mongoose.connect('mongodb://127.0.0.1:27017/amazonDB')
  .then(() => console.log('Connected to MongoDB amazonDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema Definition (Documents format)
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Model Export (Collection: userdbs)
module.exports = mongoose.model('userDB', userSchema);`,
    },
    'views/index.ejs': {
      lang: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Backend Express & EJS App</title>
  <link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome to Index.Js file (Home Route)</h1>
    <p>Session and Cookies configured. Try visiting the endpoints:</p>

    <ul>
      <li><a href="/create">/create (Insert sample user in MongoDB)</a></li>
      <li><a href="/allUser">/allUser (Read all users)</a></li>
      <li><a href="/checkSession">/checkSession (Read session)</a></li>
      <li><a href="/checkCookie">/checkCookie (Read cookies)</a></li>
      <li><a href="/delete">/delete (Delete user 'wissem')</a></li>
    </ul>
  </div>
</body>
</html>`,
    },
    'package.json': {
      lang: 'json',
      content: `{
  "name": "backend-mastery-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "debug": "~2.6.9",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "http-errors": "~1.6.3",
    "mongoose": "^8.0.0",
    "morgan": "~1.9.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}`,
    },
    '.env': {
      lang: 'bash',
      content: `PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/amazonDB
SESSION_SECRET=super-secret-backend-key-change-in-production
NODE_ENV=development`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(FILE_CONTENTS[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([FILE_CONTENTS[activeFile].content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile.split('/').pop() || 'file.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Production Ready Code</span>
          <span aria-hidden="true">·</span>
          <span>Express Generator Architecture</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-400">Node.js + EJS + MongoDB</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">
          Export Source Files & Boilerplate
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-0.5">
          Clean, verified code files directly matching your backend guide. Copy or download individual files to run locally with <code className="text-emerald-400 font-mono">npm start</code> or <code className="text-emerald-400 font-mono">npx nodemon</code>.
        </p>
      </div>

      {/* Editor & File List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
              <FolderTree className="h-4 w-4 text-emerald-400" />
              <span>Project File Structure</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {Object.keys(FILE_CONTENTS).map((fileName) => {
                const isActive = activeFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => setActiveFile(fileName)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-emerald-400 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="h-3.5 w-3.5" />
                      <span>{fileName}</span>
                    </div>
                    {isActive && <span className="text-[10px] text-emerald-400">active</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2 text-xs text-slate-400">
            <div className="text-slate-200 font-semibold">How to run locally:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 font-mono text-[11px]">
              <li>git clone or create files</li>
              <li>npm install</li>
              <li>mongod (in separate terminal)</li>
              <li>npx nodemon</li>
            </ol>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold text-slate-200">{activeFile}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1 text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold rounded-lg transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 max-h-[500px] overflow-y-auto leading-relaxed">
            {FILE_CONTENTS[activeFile].content}
          </pre>
        </div>
      </div>
    </div>
  );
};
