import React from "react";
import { getColumns, createColumn, updateColumn, deleteColumn, createTask, moveTask } from "../api/client";
import type { Column as ColumnType, Task } from "../api/client";
import Column from "./Column";
import { Plus } from "lucide-react";

export default function KanbanBoard({ boardId }: { boardId: number }) {
  const [columns, setColumns] = React.useState<ColumnType[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = async () => {
    const data = await getColumns(boardId);
    setColumns(data);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, [boardId]);

  const handleAddColumn = async () => {
    const col = await createColumn(boardId, "新列");
    setColumns((prev) => [...prev, col]);
  };

  const handleRenameColumn = async (id: number, title: string) => {
    const updated = await updateColumn(id, title);
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title: updated.title } : c)));
  };

  const handleDeleteColumn = async (id: number) => {
    await deleteColumn(id);
    setColumns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddTask = async (columnId: number, title: string) => {
    const task = await createTask(columnId, title);
    setColumns((prev) =>
      prev.map((c) => (c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c))
    );
  };

  const handleMoveTask = async (taskId: number, targetColumnId: number, position: number) => {
    // Optimistic update
    setColumns((prev) => {
      const source = prev.flatMap((c) => c.tasks).find((t) => t.id === taskId);
      if (!source) return prev;
      const task = { ...source, columnId: targetColumnId };
      return prev.map((c) => {
        const filtered = c.tasks.filter((t) => t.id !== taskId);
        if (c.id === targetColumnId) {
          const updated = [...filtered];
          updated.splice(position, 0, task);
          return { ...c, tasks: updated };
        }
        return { ...c, tasks: filtered };
      });
    });
    await moveTask(taskId, targetColumnId, position);
  };

  if (loading) return <div className="p-8 text-slate-400">加载中...</div>;

  return (
    <div className="flex gap-4 p-6 h-full items-start min-w-max">
      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          onAddTask={handleAddTask}
          onRenameColumn={handleRenameColumn}
          onDeleteColumn={handleDeleteColumn}
          onMoveTask={handleMoveTask}
          allColumns={columns}
        />
      ))}
      <button
        onClick={handleAddColumn}
        className="flex-shrink-0 w-72 border-2 border-dashed border-slate-300 rounded-xl p-4 text-slate-400 hover:border-blue-400 hover:text-blue-500 text-sm flex items-center justify-center gap-1 h-fit"
      >
        <Plus className="w-4 h-4" /> 添加列
      </button>
    </div>
  );
}
