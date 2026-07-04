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

  const skip = (page - 1) * limit;

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
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

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
