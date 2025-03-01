import { UserDoc, BlogPostDoc, TodoDoc, CookieItem, SessionData } from '../types';

export const INITIAL_USERS: UserDoc[] = [
  {
    _id: '65411c6ea1039336d4d364cc',
    username: 'wissem',
    name: 'wissem',
    age: 20,
    email: 'wissem@backend.dev',
    bio: 'Full-Stack Node.js, Express & MongoDB developer building high performance REST APIs.',
    avatarUrl: '/src/assets/images/avatar_developer_1791193190767.jpg',
    role: 'admin',
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-10-01T14:20:00.000Z',
    __v: 0,
  },
  {
    _id: '65411c6ea1039336d4d364cd',
    username: 'priya_dev',
    name: 'Priya Sharma',
    age: 23,
    email: 'priya@cloud.io',
    bio: 'Database systems architect and backend engineer specializing in Mongoose aggregation.',
    avatarUrl: '',
    role: 'author',
    createdAt: '2026-09-18T08:30:00.000Z',
    updatedAt: '2026-10-02T11:15:00.000Z',
    __v: 0,
  },
  {
    _id: '65411c6ea1039336d4d364ce',
    username: 'rohit_k',
    name: 'Rohit Kumar',
    age: 21,
    email: 'rohit@tech.org',
    bio: 'Software engineer passionate about session management and stateless JWT authentication.',
    avatarUrl: '',
    role: 'user',
    createdAt: '2026-09-22T12:00:00.000Z',
    updatedAt: '2026-10-03T09:40:00.000Z',
    __v: 0,
  },
];

export const INITIAL_POSTS: BlogPostDoc[] = [
  {
    _id: '65411e80a1039336d4d36501',
    title: 'A to Z Guide to Node.js, Express.js & MongoDB Architecture',
    slug: 'guide-nodejs-express-mongodb-architecture',
    excerpt: 'Master backend fundamentals from npm init and Express Generator to Mongoose schemas, models, and robust error handlers.',
    content: `Building a modern production-ready backend requires understanding how Express middleware, Mongoose ODM, and the Node.js event loop work in harmony.

### Key Milestones Covered
1. **Express Server Initialization**: Configuring view engines (EJS), body parsers, and static asset middleware.
2. **Database Formation vs Schema**: In MongoDB, a Database contains Collections (Models in Mongoose), which hold Documents governed by Schemas.
3. **Session vs Cookies**: Client-side storage vs server-side signed state with express-session.
4. **CRUD Execution**: Asynchronous querying with async/await and robust try/catch blocks.`,
    category: 'Backend',
    authorId: '65411c6ea1039336d4d364cc',
    authorName: 'wissem',
    authorUsername: 'wissem',
    authorAvatar: '/src/assets/images/avatar_developer_1791193190767.jpg',
    coverImage: '/src/assets/images/blog_cover_tech_1791193167640.jpg',
    likes: ['65411c6ea1039336d4d364cd', '65411c6ea1039336d4d364ce'],
    comments: [
      {
        _id: 'c1',
        userId: '65411c6ea1039336d4d364cd',
        username: 'priya_dev',
        userAvatar: '',
        content: 'The comparison table between code side (Model/Schema) and Mongo side (Collection/Document) makes it crystal clear!',
        createdAt: '2026-09-20T14:10:00.000Z',
      },
    ],
    published: true,
    createdAt: '2026-09-19T09:15:00.000Z',
    updatedAt: '2026-10-04T16:00:00.000Z',
    __v: 0,
  },
  {
    _id: '65411e80a1039336d4d36502',
    title: 'Deep Dive: Express Sessions, Cookie-Parser, and Stateful Auth',
    slug: 'express-sessions-cookie-parser-stateful-auth',
    excerpt: 'Understand how connect.sid cookies sign session identifiers and how express-session persists user data across requests.',
    content: `When a client initiates an HTTP request, the stateless nature of HTTP requires a mechanism to track user state.

### How Cookies Work
Data saved on client side via \`res.cookie('name', 'value')\`. The browser sends it on subsequent requests in the \`Cookie\` header.

### How Sessions Work
Server creates a session record and assigns a cryptographically signed cookie (default \`connect.sid\`). Only the identifier resides in the client cookie, while sensitive session payload stays secure on the server!`,
    category: 'Express',
    authorId: '65411c6ea1039336d4d364cd',
    authorName: 'Priya Sharma',
    authorUsername: 'priya_dev',
    authorAvatar: '',
    coverImage: '/src/assets/images/blog_cover_arch_1791193180159.jpg',
    likes: ['65411c6ea1039336d4d364cc'],
    comments: [
      {
        _id: 'c2',
        userId: '65411c6ea1039336d4d364ce',
        username: 'rohit_k',
        userAvatar: '',
        content: 'Great explanation on resave: false and saveUninitialized: false flags.',
        createdAt: '2026-09-23T11:00:00.000Z',
      },
    ],
    published: true,
    createdAt: '2026-09-22T10:45:00.000Z',
    updatedAt: '2026-10-03T18:20:00.000Z',
    __v: 0,
  },
  {
    _id: '65411e80a1039336d4d36503',
    title: 'Scaling Mongoose Queries: find(), findOne() & Aggregation Pipelines',
    slug: 'scaling-mongoose-queries-find-findone-aggregation',
    excerpt: 'Optimizing database queries in Node.js applications with indexes, lean queries, and projection.',
    content: `When querying collections with thousands of documents, executing \`.find()\` without projection or indexing can degrade throughput.

Using \`.lean()\` bypasses document hydration overhead, while \`.select('username email')\` drastically reduces memory footprint during serialized JSON responses.`,
    category: 'MongoDB',
    authorId: '65411c6ea1039336d4d364cc',
    authorName: 'wissem',
    authorUsername: 'wissem',
    authorAvatar: '/src/assets/images/avatar_developer_1791193190767.jpg',
    coverImage: '/src/assets/images/blog_cover_tech_1791193167640.jpg',
    likes: ['65411c6ea1039336d4d364ce'],
    comments: [],
    published: true,
    createdAt: '2026-09-25T15:00:00.000Z',
    updatedAt: '2026-10-02T13:40:00.000Z',
    __v: 0,
  },
];

export const INITIAL_TODOS: TodoDoc[] = [
  {
    _id: '65412010a1039336d4d36601',
    title: 'Setup Express Generator with EJS view engine',
    description: 'Run express --view=ejs yourAppName and configure public/ stylesheets and routes.',
    status: 'completed',
    priority: 'high',
    category: 'Backend',
    dueDate: '2026-10-06',
    userId: '65411c6ea1039336d4d364cc',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T11:30:00.000Z',
    __v: 0,
  },
  {
    _id: '65412010a1039336d4d36602',
    title: 'Connect Mongoose ODM to mongodb://127.0.0.1:27017/amazonDB',
    description: 'Ensure local mongod process is running and connection callback handles error state.',
    status: 'completed',
    priority: 'high',
    category: 'Database',
    dueDate: '2026-10-07',
    userId: '65411c6ea1039336d4d364cc',
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z',
    __v: 0,
  },
  {
    _id: '65412010a1039336d4d36603',
    title: 'Implement express-session middleware and test /checkSession route',
    description: 'Configure session secret, test req.session.anyExampleNameHere assignment and destroy callback.',
    status: 'in_progress',
    priority: 'medium',
    category: 'API',
    dueDate: '2026-10-09',
    userId: '65411c6ea1039336d4d364cc',
    createdAt: '2026-10-03T14:00:00.000Z',
    updatedAt: '2026-10-04T10:15:00.000Z',
    __v: 0,
  },
  {
    _id: '65412010a1039336d4d36604',
    title: 'Configure cookie-parser and cookie lifecycle',
    description: 'Implement res.cookie("nameHere", "valueHere") and verify browser devtools storage tab.',
    status: 'pending',
    priority: 'low',
    category: 'Backend',
    dueDate: '2026-10-12',
    userId: '65411c6ea1039336d4d364cc',
    createdAt: '2026-10-04T11:00:00.000Z',
    updatedAt: '2026-10-04T11:00:00.000Z',
    __v: 0,
  },
];

export const INITIAL_COOKIES: CookieItem[] = [
  {
    key: 'connect.sid',
    value: 's%3A7a9b2c3d4e5f6g7h8i9j.u1v2w3x4y5z6a7b8c9d0',
    httpOnly: true,
    secure: false,
    maxAge: 86400,
    createdAt: '2026-10-05T02:00:00.000Z',
  },
  {
    key: 'nameHere',
    value: 'valueHere',
    httpOnly: false,
    secure: false,
    maxAge: 3600,
    createdAt: '2026-10-05T02:15:00.000Z',
  },
];

export const INITIAL_SESSION: SessionData = {
  sessionId: 's%3A7a9b2c3d4e5f6g7h8i9j',
  data: {
    anyExampleNameHere: 'exampleUserData',
    userId: '65411c6ea1039336d4d364cc',
    username: 'wissem',
    role: 'admin',
    isLoggedIn: true,
    lastActive: '2026-10-05T02:30:00.000Z',
  },
  expiresAt: '2026-10-06T02:30:00.000Z',
  createdAt: '2026-10-05T02:00:00.000Z',
};
