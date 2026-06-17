import React from "react";
import { useDrop } from "react-dnd";
import type { Column as ColumnType, Task } from "../api/client";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { Trash2 } from "lucide-react";

const COL_COLORS: Record<number, string> = {
  0: "border-l-blue-400",
  1: "border-l-yellow-400",
  2: "border-l-green-400",
  3: "border-l-purple-400",
  4: "border-l-orange-400",
  5: "border-l-pink-400",
};

export default function Column({
  column,
  onAddTask,
  onRenameColumn,
  onDeleteColumn,
  onMoveTask,
  allColumns,
}: {
  column: ColumnType;
  onAddTask: (columnId: number, title: string) => Promise<void>;
  onRenameColumn: (id: number, title: string) => Promise<void>;
  onDeleteColumn: (id: number) => Promise<void>;
  onMoveTask: (taskId: number, targetColumnId: number, position: number) => Promise<void>;
  allColumns: ColumnType[];
}) {
  const [editing, setEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(column.title);

  const [{ isOver }, dropRef] = useDrop<{ id: number; columnId: number }, void, { isOver: boolean }>({
    accept: "TASK",
    drop: (item) => {
      if (item.columnId !== column.id) {
        onMoveTask(item.id, column.id, column.tasks.length);
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const colorClass = COL_COLORS[column.position] || "border-l-slate-400";

  const submitRename = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setEditTitle(column.title);
    }
    setEditing(false);
  };

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className={`flex-shrink-0 w-72 bg-slate-100 rounded-xl flex flex-col max-h-[calc(100vh-140px)] border-l-4 ${colorClass} ${isOver ? "ring-2 ring-blue-300" : ""}`}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-1">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={submitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") {
                  setEditTitle(column.title);
                  setEditing(false);
                }
              }}
              className="w-full text-sm font-medium bg-white border rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <button
              onClick={() => {
                setEditTitle(column.title);
                setEditing(true);
              }}
              className="text-left font-medium text-sm text-slate-700 hover:text-blue-600 cursor-pointer"
              title="双击修改列名"
            >
              {column.title}
            </button>
          )}
          <span className="ml-2 text-xs text-slate-400">{column.tasks.length}</span>
        </div>
        <button onClick={() => onDeleteColumn(column.id)} className="text-slate-300 hover:text-red-500 p-0.5 flex-shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
        {column.tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            index={idx}
            columnId={column.id}
            onMoveTask={onMoveTask}
            allColumns={allColumns}
          />
        ))}
      </div>
      <div className="px-2 pb-2">
        <AddTask onAdd={(title) => onAddTask(column.id, title)} />
      </div>
    </div>
  );
}
