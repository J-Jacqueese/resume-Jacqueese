import React from "react";
import { getBoards, createBoard, updateBoard } from "../api/client";
import type { Board as BoardType, User } from "../api/client";
import KanbanBoard from "./KanbanBoard";
import { Plus, LogOut } from "lucide-react";

export default function Board({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [boards, setBoards] = React.useState<BoardType[]>([]);
  const [activeBoardId, setActiveBoardId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadBoards = async () => {
    const data = await getBoards(user.id);
    setBoards(data);
    if (data.length > 0 && !activeBoardId) {
      setActiveBoardId(data[0].id);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadBoards();
  }, [user.id]);

  const handleCreateBoard = async () => {
    const board = await createBoard("新建看板", user.id);
    setBoards((prev) => [...prev, board]);
    setActiveBoardId(board.id);
  };

  const handleRenameBoard = async (id: number, title: string) => {
    const updated = await updateBoard(id, title);
    setBoards((prev) => prev.map((b) => (b.id === id ? { ...b, title: updated.title } : b)));
  };

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b px-4 py-3 flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-800">TaskFlow</h1>
        <nav className="flex items-center gap-2 flex-1 overflow-x-auto">
          {boards.map((b) => (
            <BoardTab
              key={b.id}
              board={b}
              isActive={activeBoardId === b.id}
              onSelect={() => setActiveBoardId(b.id)}
              onRename={(title) => handleRenameBoard(b.id, title)}
            />
          ))}
          <button onClick={handleCreateBoard} className="p-1.5 text-slate-400 hover:text-blue-600">
            <Plus className="w-4 h-4" />
          </button>
        </nav>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{user.name}</span>
          <button onClick={onLogout} className="p-1 hover:text-red-500" title="退出">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-slate-400">加载中...</div>
        ) : boards.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <button
              onClick={handleCreateBoard}
              className="bg-blue-600 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 创建第一个看板
            </button>
          </div>
        ) : (
          activeBoardId && <KanbanBoard key={activeBoardId} boardId={activeBoardId} />
        )}
      </main>
    </div>
  );
}

function BoardTab({
  board,
  isActive,
  onSelect,
  onRename,
}: {
  board: BoardType;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(board.title);

  React.useEffect(() => {
    setValue(board.title);
  }, [board.title]);

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== board.title) {
      onRename(trimmed);
    } else {
      setValue(board.title);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={submit}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") {
            setValue(board.title);
            setEditing(false);
          }
        }}
        className="px-3 py-1.5 rounded-md text-sm bg-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        autoFocus
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <button
      onClick={onSelect}
      onDoubleClick={() => setEditing(true)}
      className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${
        isActive ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"
      }`}
      title="双击修改看板名称"
    >
      {board.title}
    </button>
  );
}
