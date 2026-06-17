export interface User {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  taskId: number;
  author: string;
  text: string;
  createdAt: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TaskTag {
  taskId: number;
  tagId: number;
  tag: Tag;
}

export interface Task {
  id: number;
  columnId: number;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  assignee?: string;
  position: number;
  comments: Comment[];
  tags: TaskTag[];
}

export interface Column {
  id: number;
  boardId: number;
  title: string;
  position: number;
  tasks: Task[];
}

export interface Board {
  id: number;
  title: string;
  userId: number;
  columns: Column[];
}

const BASE = "http://localhost:4000";

export async function getUser(name: string): Promise<User> {
  const res = await fetch(`${BASE}/users/${encodeURIComponent(name)}`);
  return res.json();
}

export async function getBoards(userId: number): Promise<Board[]> {
  const res = await fetch(`${BASE}/boards/${userId}`);
  return res.json();
}

export async function createBoard(title: string, userId: number): Promise<Board> {
  const res = await fetch(`${BASE}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, userId }),
  });
  return res.json();
}

export async function updateBoard(id: number, title: string): Promise<Board> {
  const res = await fetch(`${BASE}/boards/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function getColumns(boardId: number): Promise<Column[]> {
  const res = await fetch(`${BASE}/boards/${boardId}/columns`);
  return res.json();
}

export async function createColumn(boardId: number, title: string): Promise<Column> {
  const res = await fetch(`${BASE}/columns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ boardId, title }),
  });
  return res.json();
}

export async function updateColumn(id: number, title: string): Promise<Column> {
  const res = await fetch(`${BASE}/columns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function deleteColumn(id: number): Promise<void> {
  await fetch(`${BASE}/columns/${id}`, { method: "DELETE" });
}

export async function createTask(columnId: number, title: string): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId, title }),
  });
  return res.json();
}

export async function moveTask(id: number, targetColumnId: number, position: number): Promise<void> {
  await fetch(`${BASE}/tasks/${id}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetColumnId, position }),
  });
}

export async function updateTask(
  id: number,
  data: {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assignee?: string;
    tags?: string[];
  }
): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createComment(taskId: number, author: string, text: string): Promise<Comment> {
  const res = await fetch(`${BASE}/tasks/${taskId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text }),
  });
  return res.json();
}
