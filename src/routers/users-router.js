const express = require('express')
const { auth } = require('../middlewares/auth')

const { signup, login } = require('../controllers/users-controllers')

const usersRouter = express.Router()

usersRouter.post('/signup', signup)
usersRouter.post('/login', login)
usersRouter.get('/me', auth, (req, res) => res.json({ user: req.user }))

module.exports = { usersRouter }
