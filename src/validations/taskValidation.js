const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  status: Joi.string().valid('PENDING', 'COMPLETED').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
  status: Joi.string().valid('PENDING', 'COMPLETED').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
});

module.exports = { createTaskSchema, updateTaskSchema };
