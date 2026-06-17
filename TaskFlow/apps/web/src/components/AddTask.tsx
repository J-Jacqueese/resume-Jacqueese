import React from "react";

export default function AddTask({ onAdd }: { onAdd: (title: string) => Promise<void> }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd(title.trim());
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left text-sm text-slate-400 hover:text-slate-600 py-2 px-2 rounded-lg hover:bg-white/50"
      >
        + 添加卡片
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="输入任务标题"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
        onBlur={() => {
          if (!title.trim()) setOpen(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      />
    </form>
  );
}
