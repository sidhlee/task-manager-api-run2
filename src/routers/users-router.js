const express = require('express')
const { auth } = require('../middlewares/auth')

const {
  signup,
  login,
  updateUser,
} = require('../controllers/users-controllers')

const usersRouter = express.Router()

usersRouter.post('/signup', signup)
usersRouter.post('/login', login)
usersRouter.get('/me', auth, (req, res) => res.json({ user: req.user }))
usersRouter.patch('/me', auth, updateUser)

module.exports = { usersRouter }
