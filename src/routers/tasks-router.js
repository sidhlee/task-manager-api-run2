const express = require('express')
const { auth } = require('../middlewares')

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
tasksRouter.post('/', createTask)
tasksRouter.patch('/:id', updateTask)
tasksRouter.delete('/:id', deleteTask)

module.exports = tasksRouter
