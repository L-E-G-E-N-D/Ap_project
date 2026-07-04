const taskService = require('../services/taskService');
const { success } = require('../utils/apiResponse');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return res.status(201).json(success('Task created successfully', task));
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { priority, status, search, sort, page, limit, overdue } = req.query;
    const result = await taskService.getTasks(req.user.id, {
      priority,
      status,
      search,
      sort,
      page,
      limit,
      overdue,
    });
    return res.status(200).json(success('Tasks retrieved successfully', result));
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    return res.status(200).json(success('Task retrieved successfully', task));
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return res.status(200).json(success('Task updated successfully', task));
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.user.id, req.params.id);
    return res.status(200).json(success('Task deleted successfully'));
  } catch (error) {
    next(error);
  }
};

const restoreTask = async (req, res, next) => {
  try {
    const task = await taskService.restoreTask(req.user.id, req.params.id);
    return res.status(200).json(success('Task restored successfully', task));
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const task = await taskService.completeTask(req.user.id, req.params.id);
    return res.status(200).json(success('Task completed successfully', task));
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await taskService.getStats(req.user.id);
    return res.status(200).json(success('Task statistics retrieved successfully', stats));
  } catch (error) {
    next(error);
  }
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
