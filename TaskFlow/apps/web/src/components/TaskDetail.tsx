import React from "react";
import { updateTask, createComment } from "../api/client";
import type { Task, Column } from "../api/client";
import { X, MessageCircle, Trash2 } from "lucide-react";

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;

export default function TaskDetail({
  task: initialTask,
  allColumns,
  onClose,
  onTaskUpdated,
}: {
  task: Task;
  allColumns: Column[];
  onClose: () => void;
  onTaskUpdated: (task: Task) => void;
}) {
  const [task, setTask] = React.useState(initialTask);
  const [title, setTitle] = React.useState(task.title);
  const [description, setDescription] = React.useState(task.description || "");
  const [priority, setPriority] = React.useState(task.priority);
  const [dueDate, setDueDate] = React.useState(task.dueDate || "");
  const [assignee, setAssignee] = React.useState(task.assignee || "");
  const [tags, setTags] = React.useState<string[]>(task.tags?.map((tt) => tt.tag.name) ?? []);
  const [newTag, setNewTag] = React.useState("");
  const [commentText, setCommentText] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const column = allColumns.find((c) => c.id === task.columnId);

  const save = async () => {
    setSaving(true);
    const updated = await updateTask(task.id, {
      title,
      description,
      priority,
      dueDate,
      assignee,
      tags,
    });
    setTask(updated);
    setSaving(false);
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    const comment = await createComment(task.id, "当前用户", commentText.trim());
    setTask((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    setCommentText("");
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-slate-400">
            列：{column?.title || "—"}
          </span>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          className="w-full text-lg font-semibold border-b border-transparent focus:border-blue-300 pb-1 mb-4 focus:outline-none"
        />

        {/* Priority */}
        <label className="block text-xs text-slate-500 mb-1">优先级</label>
        <div className="flex gap-1.5 mb-4">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => { setPriority(p); save(); }}
              className={`px-3 py-1 rounded-full text-xs ${
                priority === p
                  ? p === "HIGH" ? "bg-red-100 text-red-700" : p === "MEDIUM" ? "bg-orange-100 text-orange-700" : "bg-gray-200 text-gray-700"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {p === "HIGH" ? "高" : p === "MEDIUM" ? "中" : "低"}
            </button>
          ))}
        </div>

        {/* Description */}
        <label className="block text-xs text-slate-500 mb-1">描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={save}
          className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="添加详细描述..."
        />

        {/* Due Date */}
        <label className="block text-xs text-slate-500 mb-1">截止日期</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => { setDueDate(e.target.value); save(); }}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        {/* Assignee */}
        <label className="block text-xs text-slate-500 mb-1">指派人</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          onBlur={save}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="输入指派人姓名"
        />

        {/* Tags */}
        <label className="block text-xs text-slate-500 mb-1">标签</label>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              {tag}
              <button onClick={() => { setTags(tags.filter((t) => t !== tag)); save(); }}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-1 mb-6">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className="flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="新标签..."
          />
          <button onClick={addTag} className="px-3 py-1.5 bg-slate-100 text-xs rounded-lg hover:bg-slate-200">添加</button>
        </div>

        {/* Comments */}
        <label className="block text-xs text-slate-500 mb-2 flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" /> 评论 ({task.comments?.length ?? 0})
        </label>
        <div className="space-y-3 mb-4">
          {task.comments?.map((c) => (
            <div key={c.id} className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-700">{c.author}</span>
                <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-600">{c.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="写评论..."
          />
          <button onClick={addComment} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
