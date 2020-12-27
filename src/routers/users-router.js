const express = require('express')
const { check } = require('express-validator')
const { auth, validate } = require('../middlewares')

const {
  signup,
  login,
  updateUser,
} = require('../controllers/users-controllers')

const usersRouter = express.Router()

usersRouter.get('/me', auth, (req, res) => res.json({ user: req.user }))

const passwordValidator = (v) => {
  const hasSpace = /\s/.test(v)
  const hasThreeRepeatedCharacters = /([\s\S])\1\1/.test(v)
  if (hasSpace) {
    throw new Error('Password cannot contain space.')
  }
  if (hasThreeRepeatedCharacters) {
    throw new Error('Password cannot contain more than 3 repeated characters.')
  }
}

usersRouter.post(
  '/login',
  // express-validator allows us to handle input errors separately
  // - Schema validation (e.g. required) just dumps its own error into global handler
  // which makes it hard to customize error response
  [
    check('email').normalizeEmail().isEmail(),
    check('password').custom(passwordValidator),
  ],
  validate,
  login
)

/* Routes that takes name, email, and password */
usersRouter.use(
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').custom(passwordValidator),
  ],
  validate
)

usersRouter.post('/signup', signup)
usersRouter.patch('/me', auth, updateUser)

module.exports = usersRouter
