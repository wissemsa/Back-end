import React from 'react';
import { ActiveTab, UserDoc } from '../types';
import { Database, RotateCcw, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: UserDoc;
  allUsers: UserDoc[];
  onSwitchUser: (userId: string) => void;
  onResetDatabase: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  allUsers,
  onSwitchUser,
  onResetDatabase,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('apps');
          }}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="h-4 w-4" />
          </span>
          <span>NodeForge</span>
        </a>

        {/* Zone 2: 4-5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onTabChange('apps')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'apps'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Live Projects
          </button>
          <button
            onClick={() => onTabChange('mongo')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'mongo'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            MongoDB Visualizer
          </button>
          <button
            onClick={() => onTabChange('session')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'session'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Session & Cookies
          </button>
          <button
            onClick={() => onTabChange('ejs')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ejs'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            EJS & Pipeline
          </button>
          <button
            onClick={() => onTabChange('export')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Export Boilerplate
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* User selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <UserIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline text-slate-500 font-mono">auth:</span>
            <select
              value={currentUser._id}
              onChange={(e) => onSwitchUser(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              {allUsers.map((u) => (
                <option key={u._id} value={u._id} className="bg-slate-900 text-slate-200">
                  {u.username} ({u.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetDatabase}
            title="Reset database and localStorage to initial seed"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-900 bg-slate-950 px-2 py-1.5 text-xs">
        <button
          onClick={() => onTabChange('apps')}
          className={`px-2 py-1 rounded ${activeTab === 'apps' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Projects
        </button>
        <button
          onClick={() => onTabChange('mongo')}
          className={`px-2 py-1 rounded ${activeTab === 'mongo' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          MongoDB
        </button>
        <button
          onClick={() => onTabChange('session')}
          className={`px-2 py-1 rounded ${activeTab === 'session' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Session
        </button>
        <button
          onClick={() => onTabChange('ejs')}
          className={`px-2 py-1 rounded ${activeTab === 'ejs' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          EJS
        </button>
        <button
          onClick={() => onTabChange('export')}
          className={`px-2 py-1 rounded ${activeTab === 'export' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Code
        </button>
      </div>
    </header>
  );
};
