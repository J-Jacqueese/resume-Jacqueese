import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { name: "demo" },
    update: {},
    create: { name: "demo" },
  });

  // Create a board
  const board = await prisma.board.create({
    data: {
      title: "我的第一个看板",
      userId: user.id,
    },
  });

  // Create columns
  const todo = await prisma.column.create({
    data: { boardId: board.id, title: "待办", position: 0 },
  });
  const doing = await prisma.column.create({
    data: { boardId: board.id, title: "进行中", position: 1 },
  });
  const done = await prisma.column.create({
    data: { boardId: board.id, title: "完成", position: 2 },
  });

  // Create some tags
  const bug = await prisma.tag.create({ data: { name: "bug" } });
  const feature = await prisma.tag.create({ data: { name: "feature" } });

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      columnId: todo.id,
      title: "设计登录页面",
      description: "用 Tailwind 做一个简洁的登录表单",
      priority: "HIGH",
      assignee: "张三",
      position: 0,
    },
  });
  await prisma.taskTag.create({ data: { taskId: task1.id, tagId: feature.id } });

  const task2 = await prisma.task.create({
    data: {
      columnId: todo.id,
      title: "写 API 文档",
      description: "列出所有接口的请求/响应格式",
      priority: "MEDIUM",
      position: 1,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      columnId: doing.id,
      title: "实现拖拽排序",
      description: "用 react-dnd 实现卡片跨列拖拽",
      priority: "HIGH",
      assignee: "李四",
      position: 0,
    },
  });
  await prisma.taskTag.create({ data: { taskId: task3.id, tagId: feature.id } });

  const task4 = await prisma.task.create({
    data: {
      columnId: doing.id,
      title: "修复评论加载闪烁",
      description: "评论列表在加载时出现闪烁，加骨架屏",
      priority: "LOW",
      position: 1,
    },
  });
  await prisma.taskTag.create({ data: { taskId: task4.id, tagId: bug.id } });

  const task5 = await prisma.task.create({
    data: {
      columnId: done.id,
      title: "初始化项目仓库",
      description: "搭好 monorepo + pnpm workspace",
      priority: "HIGH",
      assignee: "张三",
      position: 0,
    },
  });

  // Add comments
  await prisma.comment.create({
    data: { taskId: task3.id, author: "demo", text: "拖拽很流畅，继续加油！" },
  });

  console.log("✅ 种子数据填充完成！");
  console.log(`   用户: ${user.name}`);
  console.log(`   看板: ${board.title}`);
  console.log(`   列: ${todo.title}, ${doing.title}, ${done.title}`);
  console.log(`   任务: ${[task1, task2, task3, task4, task5].length} 个`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
