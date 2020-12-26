const express = require('express')

const {
  getUserTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks-controllers')

const taskRouter = express.Router()

taskRouter.get('/', getUserTasks)
taskRouter.get('/:id', getTaskById)
taskRouter.post('/', createTask)
taskRouter.patch('/:id', updateTask)
taskRouter.delete('/:id', deleteTask)

module.exports = taskRouter
