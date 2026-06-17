import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: [/^http:\/\/localhost:\d+$/] }));
app.use(express.json());

// ---- Boards ----

app.get("/boards/:userId", async (req, res) => {
  const boards = await prisma.board.findMany({
    where: { userId: Number(req.params.userId) },
    include: { columns: { orderBy: { position: "asc" }, include: { tasks: { orderBy: { position: "asc" }, include: { comments: true, tags: { include: { tag: true } } } } } } },
  });
  res.json(boards);
});

app.post("/boards", async (req, res) => {
  const { title, userId } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const board = await prisma.board.create({
    data: { title, userId: Number(userId) },
  });
  // Auto-create 3 default columns
  await prisma.column.createMany({
    data: [
      { boardId: board.id, title: "待办", position: 0 },
      { boardId: board.id, title: "进行中", position: 1 },
      { boardId: board.id, title: "完成", position: 2 },
    ],
  });
  const full = await prisma.board.findUnique({
    where: { id: board.id },
    include: { columns: { orderBy: { position: "asc" }, include: { tasks: true } } },
  });
  res.status(201).json(full);
});

app.patch("/boards/:id", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const board = await prisma.board.update({
    where: { id: Number(req.params.id) },
    data: { title },
    include: { columns: { orderBy: { position: "asc" }, include: { tasks: true } } },
  });
  res.json(board);
});

// ---- Columns ----

app.get("/boards/:id/columns", async (req, res) => {
  const columns = await prisma.column.findMany({
    where: { boardId: Number(req.params.id) },
    orderBy: { position: "asc" },
    include: { tasks: { orderBy: { position: "asc" }, include: { comments: true, tags: { include: { tag: true } } } } },
  });
  res.json(columns);
});

app.post("/columns", async (req, res) => {
  const { boardId, title } = req.body;
  if (!boardId || !title) return res.status(400).json({ error: "boardId and title are required" });
  const max = await prisma.column.findFirst({ where: { boardId: Number(boardId) }, orderBy: { position: "desc" } });
  const column = await prisma.column.create({
    data: { boardId: Number(boardId), title, position: (max?.position ?? -1) + 1 },
    include: { tasks: true },
  });
  res.status(201).json(column);
});

app.patch("/columns/:id", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title is required" });
  const column = await prisma.column.update({
    where: { id: Number(req.params.id) },
    data: { title },
    include: { tasks: true },
  });
  res.json(column);
});

app.delete("/columns/:id", async (req, res) => {
  await prisma.column.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

// ---- Tasks ----

app.get("/columns/:id/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { columnId: Number(req.params.id) },
    orderBy: { position: "asc" },
    include: { comments: true, tags: { include: { tag: true } } },
  });
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { columnId, title } = req.body;
  if (!columnId || !title) return res.status(400).json({ error: "columnId and title are required" });
  const max = await prisma.task.findFirst({ where: { columnId: Number(columnId) }, orderBy: { position: "desc" } });
  const task = await prisma.task.create({
    data: { columnId: Number(columnId), title, position: (max?.position ?? -1) + 1 },
    include: { comments: true, tags: { include: { tag: true } } },
  });
  res.status(201).json(task);
});

app.patch("/tasks/:id/move", async (req, res) => {
  const { targetColumnId, position } = req.body;
  if (targetColumnId === undefined) return res.status(400).json({ error: "targetColumnId is required" });
  await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { columnId: Number(targetColumnId), position: Number(position) },
  });
  res.json({ ok: true });
});

app.patch("/tasks/:id", async (req, res) => {
  const { title, description, priority, dueDate, assignee, tags } = req.body;
  const data: any = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (priority !== undefined) data.priority = priority;
  if (dueDate !== undefined) data.dueDate = dueDate;
  if (assignee !== undefined) data.assignee = assignee;

  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data,
    include: { comments: true, tags: { include: { tag: true } } },
  });

  // Handle tags if provided
  if (tags !== undefined) {
    await prisma.taskTag.deleteMany({ where: { taskId: task.id } });
    for (const tagName of tags) {
      const tag = await prisma.tag.upsert({ where: { name: tagName }, update: {}, create: { name: tagName } });
      await prisma.taskTag.create({ data: { taskId: task.id, tagId: tag.id } });
    }
  }

  const updated = await prisma.task.findUnique({
    where: { id: task.id },
    include: { comments: true, tags: { include: { tag: true } } },
  });
  res.json(updated);
});

// ---- Comments ----

app.get("/tasks/:id/comments", async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { taskId: Number(req.params.id) },
    orderBy: { createdAt: "asc" },
  });
  res.json(comments);
});

app.post("/tasks/:id/comments", async (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) return res.status(400).json({ error: "author and text are required" });
  const comment = await prisma.comment.create({
    data: { taskId: Number(req.params.id), author, text },
  });
  res.status(201).json(comment);
});

// ---- Users ----

app.get("/users/:name", async (req, res) => {
  let user = await prisma.user.findUnique({ where: { name: req.params.name } });
  if (!user) {
    user = await prisma.user.create({ data: { name: req.params.name } });
    res.status(201);
  }
  res.json(user);
});

// ---- Health ----

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ---- Start ----

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
});

export default app;
