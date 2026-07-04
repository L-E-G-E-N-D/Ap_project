const prisma = require('../config/db');
const AppError = require('../utils/appError');

const createTask = async (userId, taskData) => {
  return await prisma.task.create({
    data: {
      ...taskData,
      userId,
    },
  });
};

const getTasks = async (userId, filters = {}) => {
  const { priority, status, search, sort, page = 1, limit = 10, overdue } = filters;
  const where = { userId, isDeleted: false };

  if (priority) where.priority = priority;
  if (status) where.status = status;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (overdue === 'true') {
    where.status = 'PENDING';
    where.dueDate = { lt: new Date() };
  }

  const orderBy = {};
  if (sort === 'dueDate') {
    orderBy.dueDate = 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }
  const p = parseInt(page);
  const l = parseInt(limit);
  const skip = (p - 1) * l;

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
    skip,
    take: l,
  });

  const total = await prisma.task.count({ where });

  return {
    tasks,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l),
    },
  };
};

const getTaskById = async (userId, id) => {
  const task = await prisma.task.findFirst({
    where: { id, userId, isDeleted: false },
  });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return task;
};

const updateTask = async (userId, id, taskData) => {
  await getTaskById(userId, id);
  return await prisma.task.update({
    where: { id },
    data: taskData,
  });
};

const deleteTask = async (userId, id) => {
  await getTaskById(userId, id);
  return await prisma.task.update({
    where: { id },
    data: { isDeleted: true },
  });
};

const restoreTask = async (userId, id) => {
  const task = await prisma.task.findFirst({
    where: { id, userId },
  });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  return await prisma.task.update({
    where: { id },
    data: { isDeleted: false },
  });
};

const completeTask = async (userId, id) => {
  await getTaskById(userId, id);
  return await prisma.task.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });
};

const getStats = async (userId) => {
  const totalTasks = await prisma.task.count({ where: { userId, isDeleted: false } });
  const completed = await prisma.task.count({ where: { userId, isDeleted: false, status: 'COMPLETED' } });
  const pending = await prisma.task.count({ where: { userId, isDeleted: false, status: 'PENDING' } });
  const highPriority = await prisma.task.count({ where: { userId, isDeleted: false, priority: 'HIGH' } });
  const overdue = await prisma.task.count({
    where: {
      userId,
      isDeleted: false,
      status: 'PENDING',
      dueDate: { lt: new Date() },
    },
  });

  return { totalTasks, completed, pending, highPriority, overdue };
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  restoreTask,
  completeTask,
  getStats,
};
