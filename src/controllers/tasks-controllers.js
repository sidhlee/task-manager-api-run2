const HttpError = require('../models/http-error')

const { Task } = require('../models')

const getTaskById = async (req, res, next) => {
  const { id } = req.params
  const task = await Task.findOne({
    id,
    creator: req.user.id, // users can only get their own tasks
  })
  if (!task) {
    return next(new HttpError('Could not find the task', 422))
  }
  return res.json(task)
}

const getUserTasks = async (req, res, next) => {
  const { completed, limit, skip, sort } = req.query

  // http://myapp.com/books?sort=author asc,datepublished desc&count=12
  // encoded: http://myapp.com/books?sort=author+asc,datepublished+desc&count=12
  const sortObj = {}
  if (sort) {
    sort.split(',').forEach((s) => {
      const [by, order] = s.split('+')
      sort[by] = order === 'asc' ? 1 : -1
    })
  }

  await req.user
    .populate({
      path: 'tasks',
      match: { completed: !!completed },
      options: {
        limit: +limit,
        skip: +skip,
        sort: sortObj,
      },
    })
    .execPopulate()

  return res.json({ tasks: req.user.tasks })
}

const createTask = async (req, res) => {
  const { description } = req.body
  const task = new Task({
    description,
    creator: req.user._id,
  })
  await task.save()

  return res.status(201).json({ task })
}

const updateTask = async (req, res, next) => {
  const { description, completed } = req.body

  const task = await Task.findOne({
    _id: req.params.id,
    creator: req.user._id,
  })
  if (!task) {
    return next(new HttpError('Could not find the task', 422))
  }
  task.description = description
  task.completed = completed
  await task.save()

  return res.json({ task })
}

const deleteTask = async (req, res, next) => {
  const { id } = req.params

  const task = await Task.findOne({
    _id: id,
    creator: req.user.id,
  })
  if (!task) {
    return next(new HttpError('Could not find the task', 422))
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
