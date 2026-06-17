import React from "react";
import { getUser } from "../api/client";
import type { User } from "../api/client";
import { LogIn } from "lucide-react";

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const user = await getUser(name.trim());
    onLogin(user);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8 w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">TaskFlow</h1>
          <p className="text-slate-500 text-sm mt-1">极简任务流 Kanban</p>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入用户名进入看板"
          className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          {loading ? "进入中..." : "进入看板"}
        </button>
      </form>
    </div>
  );
}
