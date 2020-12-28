const HttpError = require('../models/http-error')

const { Task } = require('../models')

const getTaskById = async (req, res, next) => {
  const { id } = req.params
  const task = await Task.findOne({
    _id: id,
  })
  if (!task) {
    return next(new HttpError('Could not find the task', 422))
  }
  // users can only get their own tasks
  if (task.creator.toString() !== req.user._id.toString()) {
    return next(new HttpError('Could not find the task', 401))
  }
  return res.json(task)
}

const getUserTasks = async (req, res, next) => {
  const { completed, limit, skip, sort } = req.query

  const match = {}
  // completed will either be undefined | "true" | "false"
  if (completed) {
    match[completed] = completed === 'true'
  }

  const options = {}
  // http://myapp.com/books?sort=author asc,datepublished desc&count=12
  // encoded: http://myapp.com/books?sort=author+asc,datepublished+desc&count=12
  const sortObj = {}

  if (sort) {
    sort.split(',').forEach((s) => {
      const [by, order] = s.split('_')
      sortObj[by] = order === 'asc' ? 1 : -1
    })
    options.sort = sortObj
  }

  if (limit && typeof parseInt(limit, 10) === 'number') {
    options.limit = +limit
  }
  if (skip && typeof parseInt(skip, 10) === 'number') {
    options.skip = +skip
  }

  const populateOption = {
    path: 'tasks',
    match,
    options,
  }

  await req.user.populate(populateOption).execPopulate()

  return res.json({ tasks: req.user.tasks })
}

const createTask = async (req, res, next) => {
  const { description, completed } = req.body
  const task = new Task({
    description,
    creator: req.user._id,
  })
  if (completed !== undefined) {
    task.completed = completed
  }
  try {
    await task.save()
  } catch (err) {
    return next(err)
  }

  return res.status(201).json({ task })
}

const updateTask = async (req, res, next) => {
  const { description, completed } = req.body

  const task = await Task.findOne({
    _id: req.params.id,
  })

  if (!task) {
    return next(new HttpError('Could not find the task', 422))
  }

  if (task.creator.toString() !== req.user._id.toString()) {
    return next(new HttpError('Could not find the task', 401))
  }
  task.description = description
  if (completed !== undefined) {
    task.completed = completed
  }

  try {
    await task.save()
  } catch (err) {
    return next(err)
  }

  return res.json({ task })
}

const deleteTask = async (req, res, next) => {
  const { id } = req.params

  const task = await Task.findOne({
    _id: id,
  })
  if (!task) {
    return next(new HttpError('Could not find the task', 422))
  }
  if (task.creator.toString() !== req.user._id.toString()) {
    return next(new HttpError('Could not find the task', 401))
  }

  await task.remove()

  return res.json({ task })
}

module.exports = {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
