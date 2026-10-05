# NodeForge

**An interactive developer studio for learning and prototyping full-stack Node.js applications with Express, EJS, and MongoDB.**

NodeForge brings the core pieces of a classic server-rendered Node.js stack into one browser-based workspace. Explore Mongoose queries, inspect sessions and cookies, preview EJS templates, trace the Express middleware pipeline, and work with two sample applications, all without installing a database or running a backend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Data Persistence](#data-persistence)
- [Exported Boilerplate](#exported-boilerplate)
- [Contributing](#contributing)

---

## Overview

Learning the Express and MongoDB stack usually means wiring up a server, a database, a view engine, and session handling before you can see anything work. NodeForge removes that setup cost. Each concept is presented as a hands-on module that shows the equivalent server-side code next to the result it produces.

When you are ready to build the real thing, the **Code Export** module provides a matching Express project skeleton you can copy straight into your own environment.

## Features

### 1. Live Applications

Two fully interactive sample apps built on the same data layer:

- **Blog Post Engine**: create, edit, publish, and delete articles; filter by category; like posts and leave comments; edit author profiles. Document inspection shows the underlying MongoDB record for each post.
- **Task & Workflow Manager**: create tasks with priority, category, and status; filter by status and category; toggle completion and clear finished work. Each action displays the equivalent Mongoose call (for example `Todo.create({ ... })`).

### 2. MongoDB & Mongoose Visualizer

- A live query console supporting `find`, `create`, `findOne`, and `findOneAndDelete` against the `users`, `posts`, and `todos` collections.
- Side-by-side view of the Mongoose code and the equivalent `mongosh` command.
- A query log recording the method, duration, and result summary of every operation.
- Document-level inspection of collection contents.

### 3. Session & Cookie Lab

- Set, inspect, and clear cookies with `httpOnly`, `secure`, and `maxAge` options (the `cookie-parser` model).
- Read and write server-side session data to see how `express-session` keeps state on the server while the client holds only a signed session ID.
- Simulate `req.session.destroy()` and reset to a known baseline.

### 4. EJS Studio & Request Pipeline

- Edit EJS templates and data and preview the rendered output.
- Step through the Express request/response lifecycle: logger, body parsers, cookie parser, session middleware, static assets, and route handlers.

### 5. Code Export

Browse and copy a production-style Express starter, including `app.js`, route modules, an EJS view, `package.json`, and an environment file template.

### Additional Capabilities

- Switch between seeded user accounts (admin, author, user) to see role-aware behavior.
- Reset all data to the original seed state with a single action.
- Responsive dark interface with toast feedback for every operation.

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI framework | React 19 |
| Language | TypeScript |
| Build tooling | Vite |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Icons | Lucide React |

The studio teaches and exports an **Express + EJS + Mongoose + express-session** stack.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (bundled with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/wissemsa/Back-end.git
cd nodeforge

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app is served at **http://localhost:3000**.

### Production Build

```bash
npm run build     # Outputs optimized assets to dist/
npm run preview   # Serves the production build locally
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with `tsc --noEmit` |
| `npm run clean` | Remove build output |

## Project Structure

```
nodeforge/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                 # Application entry point
    ├── App.tsx                  # Root component and global state
    ├── types.ts                 # Shared TypeScript interfaces
    ├── index.css                # Tailwind and base styles
    ├── data/
    │   └── mockData.ts          # Seed users, posts, tasks, cookies, session
    ├── utils/
    │   └── storage.ts           # Persistence layer
    ├── assets/images/           # Sample avatars and cover images
    └── components/
        ├── Navbar.tsx           # Navigation, user switcher, data reset
        ├── apps/
        │   ├── BlogApp.tsx      # Blog Post Engine
        │   └── TodoApp.tsx      # Task & Workflow Manager
        ├── mongo/
        │   └── MongoVisualizer.tsx
        ├── session/
        │   └── SessionLab.tsx
        ├── ejs/
        │   └── EjsStudio.tsx
        └── export/
            └── CodeExport.tsx
```

## Data Model

NodeForge models the same document shapes you would define with Mongoose schemas.

| Collection | Key fields |
| --- | --- |
| **Users** | `username`, `name`, `age`, `email`, `bio`, `avatarUrl`, `role` (`admin` / `author` / `user`) |
| **Posts** | `title`, `slug`, `excerpt`, `content`, `category`, `author`, `coverImage`, `likes`, `comments`, `published` |
| **Todos** | `title`, `description`, `status` (`pending` / `in_progress` / `completed`), `priority`, `category`, `dueDate`, `userId` |

Every document carries `_id`, `createdAt`, `updatedAt`, and `__v`, mirroring Mongoose's defaults.

## Data Persistence

NodeForge runs entirely in the browser. Its "database" is a simulation of MongoDB behavior backed by the browser's `localStorage`, under the `nodeforge_*_v2` keys. This means:

- No MongoDB instance or backend server is required to explore the studio.
- Data persists across page reloads on the same browser.
- Use **Reset Database** in the navigation bar to restore the original seed data.

To work against a real MongoDB instance, use the generated project from the **Code Export** module.

## Exported Boilerplate

The Code Export module produces a starting point for a real server, built on:

- `express`, `ejs`, `express-session`, `cookie-parser`, `morgan`, `http-errors`
- `mongoose` for schema modeling and database access
- Environment-based configuration via `.env`

Treat the exported session secret and other placeholder values as development defaults, and replace them with secure values before any deployment.

## Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and run `npm run lint` to confirm the project type-checks
3. Commit with a clear message and open a pull request describing the change

## License

Add your preferred license here (for example MIT) and include a `LICENSE` file in the repository root.
