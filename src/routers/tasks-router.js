const express = require('express')
const { check } = require('express-validator')
const { auth, validate } = require('../middlewares')

const {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks-controllers')

const tasksRouter = express.Router()

tasksRouter.use(auth) // apply auth middleware to all tasks routes

tasksRouter.get('/', getUserTasks)
tasksRouter.get('/:id', getTaskById)
tasksRouter.delete('/:id', deleteTask)

tasksRouter.post(
  '/',
  [check('description').not().isEmpty()],
  validate,
  createTask
)
tasksRouter.patch(
  '/:id',
  [check('description').not().isEmpty()],
  validate,
  updateTask
)

module.exports = tasksRouter
