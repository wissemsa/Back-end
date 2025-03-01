import React, { useState } from 'react';
import { CookieItem, SessionData } from '../../types';
import {
  ShieldCheck,
  HardDrive,
  Cookie as CookieIcon,
  Trash2,
  Plus,
  Play,
  RotateCcw,
  ArrowRight,
  Code,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface SessionLabProps {
  cookies: CookieItem[];
  session: SessionData;
  onSetCookie: (cookie: CookieItem) => void;
  onDeleteCookie: (key: string) => void;
  onUpdateSessionData: (key: string, value: any) => void;
  onDestroySession: () => void;
  onResetSession: () => void;
}

export const SessionLab: React.FC<SessionLabProps> = ({
  cookies,
  session,
  onSetCookie,
  onDeleteCookie,
  onUpdateSessionData,
  onDestroySession,
  onResetSession,
}) => {
  // Cookie form
  const [cookieKey, setCookieKey] = useState('nameHere');
  const [cookieVal, setCookieVal] = useState('valueHere');
  const [cookieHttpOnly, setCookieHttpOnly] = useState(false);

  // Session form
  const [sessionKey, setSessionKey] = useState('anyExampleNameHere');
  const [sessionVal, setSessionVal] = useState('exampleUserData');

  // Route test simulations
  const [activeRouteOutput, setActiveRouteOutput] = useState<{
    route: string;
    status: number;
    response: string;
    consoleLog?: string;
  }>({
    route: 'GET /checkSession',
    status: 200,
    response: 'Session saved. see on your console/terminal',
    consoleLog: JSON.stringify(session.data, null, 2),
  });

  const handleTestCheckSession = () => {
    if (session.data && session.data[sessionKey]) {
      setActiveRouteOutput({
        route: 'GET /checkSession',
        status: 200,
        response: 'Session saved. see on your console/terminal',
        consoleLog: `req.session = ${JSON.stringify(session.data, null, 2)}`,
      });
    } else {
      setActiveRouteOutput({
        route: 'GET /checkSession',
        status: 200,
        response: 'Session data is not available or deleted',
        consoleLog: 'req.session = undefined',
      });
    }
  };

  const handleTestCheckCookie = () => {
    const cookieObj: Record<string, string> = {};
    cookies.forEach((c) => {
      cookieObj[c.key] = c.value;
    });

    setActiveRouteOutput({
      route: 'GET /checkCookie',
      status: 200,
      response: 'check console/terminal for cookie',
      consoleLog: `req.cookies = ${JSON.stringify(cookieObj, null, 2)}`,
    });
  };

  const handleCreateCookie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookieKey.trim()) return;

    onSetCookie({
      key: cookieKey.trim(),
      value: cookieVal.trim(),
      httpOnly: cookieHttpOnly,
      secure: false,
      maxAge: 3600,
      createdAt: new Date().toISOString(),
    });

    setActiveRouteOutput({
      route: `res.cookie("${cookieKey.trim()}", "${cookieVal.trim()}")`,
      status: 200,
      response: `Set-Cookie header emitted: ${cookieKey.trim()}=${cookieVal.trim()}`,
    });
  };

  const handleAddSessionField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionKey.trim()) return;

    onUpdateSessionData(sessionKey.trim(), sessionVal.trim());
    setActiveRouteOutput({
      route: `req.session.${sessionKey.trim()} = "${sessionVal.trim()}"`,
      status: 200,
      response: `Stored ${sessionKey.trim()} on server session storage.`,
      consoleLog: JSON.stringify({ ...session.data, [sessionKey.trim()]: sessionVal.trim() }, null, 2),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>State Management</span>
          <span aria-hidden="true">·</span>
          <span>express-session & cookie-parser</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-emerald-400">HTTP Stateless vs Stateful</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">
          Session & Cookies Interactive Lab
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl mt-0.5">
          Data saved on client side is called <span className="text-slate-200 font-medium">cookies</span>.
          Data saved on server memory is called <span className="text-slate-200 font-medium">session</span>.
          Explore the cryptographic signature handshake between client and server.
        </p>
      </div>

      {/* Comparison Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cookies Box */}
        <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CookieIcon className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Client-Side Cookies (cookie-parser)</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Browser Storage</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Saved on client side in document headers. Automatically transmitted with every HTTP request in the{' '}
            <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">Cookie</code> header.
          </p>
          <div className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
            res.cookie("nameHere", "valueHere");
          </div>
        </div>

        {/* Session Box */}
        <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Server-Side Session (express-session)</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Server RAM / Redis</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Data saved securely on the server. The client only holds an encrypted signed session ID{' '}
            <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">connect.sid</code>.
          </p>
          <div className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
            req.session.anyExampleNameHere = 'exampleUserData';
          </div>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Cookie Manager */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <CookieIcon className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Cookie Storage & Parser</h4>
            </div>
            <button
              onClick={handleTestCheckCookie}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
            >
              <Play className="h-3 w-3 fill-emerald-400" />
              <span>GET /checkCookie</span>
            </button>
          </div>

          {/* Form to Set Cookie */}
          <form onSubmit={handleCreateCookie} className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-300">Set Cookie (res.cookie)</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Key Name</label>
                <input
                  type="text"
                  value={cookieKey}
                  onChange={(e) => setCookieKey(e.target.value)}
                  placeholder="nameHere"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Value</label>
                <input
                  type="text"
                  value={cookieVal}
                  onChange={(e) => setCookieVal(e.target.value)}
                  placeholder="valueHere"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cookieHttpOnly}
                  onChange={(e) => setCookieHttpOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>httpOnly (Restricted from JS document.cookie)</span>
              </label>

              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold bg-amber-400/90 text-slate-950 hover:bg-amber-300 rounded"
              >
                Set Cookie
              </button>
            </div>
          </form>

          {/* Active Cookies List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Cookies in Browser ({cookies.length})</span>
              <span className="font-mono text-[10px]">req.cookies</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {cookies.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-2 bg-slate-950 rounded">No cookies stored</p>
              ) : (
                cookies.map((c) => (
                  <div
                    key={c.key}
                    className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/80 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-emerald-400">{c.key}</span>
                        {c.httpOnly && (
                          <span className="text-[10px] text-slate-400 bg-slate-900 px-1 rounded">
                            httpOnly
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-slate-300 truncate">{c.value}</div>
                    </div>

                    <button
                      onClick={() => onDeleteCookie(c.key)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-900"
                      title="res.clearCookie"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Session Manager */}
        <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-white">Server Session State</h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestCheckSession}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-mono"
              >
                <Play className="h-3 w-3 fill-emerald-400" />
                <span>GET /checkSession</span>
              </button>
            </div>
          </div>

          {/* Form to Store Data in Session */}
          <form onSubmit={handleAddSessionField} className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-300">Set req.session Property</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Property Key</label>
                <input
                  type="text"
                  value={sessionKey}
                  onChange={(e) => setSessionKey(e.target.value)}
                  placeholder="anyExampleNameHere"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Value</label>
                <input
                  type="text"
                  value={sessionVal}
                  onChange={(e) => setSessionVal(e.target.value)}
                  placeholder="exampleUserData"
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-3 py-1 text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 rounded"
              >
                Assign to req.session
              </button>
            </div>
          </form>

          {/* Active Server Session Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-300">Session ID:</span>
                <span className="font-mono text-emerald-400 text-[10px] truncate max-w-[180px]">
                  {session.sessionId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onDestroySession}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                  title="req.session.destroy()"
                >
                  Destroy Session
                </button>
                <button
                  onClick={onResetSession}
                  className="text-xs text-slate-400 hover:text-slate-200"
                  title="Reset to tutorial initial state"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>

            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 max-h-48 overflow-y-auto leading-relaxed">
              {Object.keys(session.data || {}).length === 0
                ? '{\n  // Session is empty or destroyed\n}'
                : JSON.stringify(session.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Live Route Call Simulation Output */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-white">Route Execution Trace</span>
          </div>
          <div className="font-mono text-slate-400 text-[11px]">
            Route: <span className="text-emerald-400">{activeRouteOutput.route}</span> · HTTP{' '}
            <span className="text-emerald-400">{activeRouteOutput.status} OK</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="text-[11px] text-slate-400 font-mono">Response Payload (res.send):</div>
            <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 font-mono text-slate-200">
              {activeRouteOutput.response}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-slate-400 font-mono">Server Terminal Log (console.log):</div>
            <pre className="bg-slate-900/90 p-2.5 rounded border border-slate-800 font-mono text-emerald-300/90 overflow-x-auto">
              {activeRouteOutput.consoleLog || '(no logs output)'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
