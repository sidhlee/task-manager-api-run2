const express = require('express')

const { signup, login } = require('../controllers/users-controllers')

const usersRouter = express.Router()

usersRouter.post('/signup', signup)
usersRouter.post('/login', login)

module.exports = { usersRouter }
