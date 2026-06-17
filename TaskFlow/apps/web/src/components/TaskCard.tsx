import React from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Task, Column } from "../api/client";
import TaskDetail from "./TaskDetail";
import { GripVertical } from "lucide-react";

const PRIORITY_COLORS = { HIGH: "bg-red-500", MEDIUM: "bg-orange-500", LOW: "bg-gray-400" };

export default function TaskCard({
  task,
  index,
  columnId,
  onMoveTask,
  allColumns,
}: {
  task: Task;
  index: number;
  columnId: number;
  onMoveTask: (taskId: number, targetColumnId: number, position: number) => Promise<void>;
  allColumns: Column[];
}) {
  const [showDetail, setShowDetail] = React.useState(false);

  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK",
    item: { id: task.id, columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, dropRef] = useDrop<{ id: number; columnId: number }, void, { isOver: boolean }>({
    accept: "TASK",
    hover: (item) => {
      if (item.id !== task.id && item.columnId === columnId) {
        onMoveTask(item.id, columnId, index);
        item.columnId = columnId;
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const priorityColor = PRIORITY_COLORS[task.priority];
  const taskTags = task.tags?.map((tt) => tt.tag) ?? [];

  return (
    <>
      <div
        ref={(node) => {
          dragRef(dropRef(node));
        }}
        className={`bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${isDragging ? "opacity-50" : ""} ${isOver ? "border-t-2 border-t-blue-400" : ""}`}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-start gap-2">
          <span className="text-slate-300 mt-0.5 flex-shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColor}`} />
              <span className="text-sm font-medium text-slate-800 truncate">{task.title}</span>
            </div>
            {task.dueDate && (
              <p className="text-xs text-slate-400 mt-1">截止 {task.dueDate}</p>
            )}
            {task.assignee && (
              <p className="text-xs text-slate-400 mt-0.5">{task.assignee}</p>
            )}
            {taskTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {taskTags.map((tag) => (
                  <span key={tag.id} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showDetail && (
        <TaskDetail
          task={task}
          allColumns={allColumns}
          onClose={() => setShowDetail(false)}
          onTaskUpdated={(updated) => {
            setShowDetail(false);
            // Parent will reload
          }}
        />
      )}
    </>
  );
}
