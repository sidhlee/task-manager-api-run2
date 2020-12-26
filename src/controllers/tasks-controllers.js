const HttpError = require('../models/http-error')

const Task = require('../models/task')

const getTaskById = async (req, res, next) => {
  const { id } = req.params
  const task = await Task.findById(id)
  if (!task) {
    return next(new HttpError('Could not find the task', 422))
  }
  return res.json(task)
}

const getUserTasks = async (req, res, next) => {}
const createTask = async (req, res, next) => {}
const updateTask = async (req, res, next) => {}
const deleteTask = async (req, res, next) => {}

module.exports = {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
