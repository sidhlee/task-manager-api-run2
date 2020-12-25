const bcrypt = require('bcryptjs')
const User = require('../models/user')
const HttpError = require('../models/http-error')

const signup = async (req, res, next) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(new HttpError('Email already exists.', 422))
  }

  const user = new User({
    name,
    email,
    password,
  })

  try {
    await user.save()

    const token = user.generateToken()
    return res.status(201).send({
      user,
      token,
    })
  } catch (err) {
    console.log(err)
    return res.status(400)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return next(new HttpError('Please check your email.', 422))
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return next(new HttpError('Please check your password.', 422))
  }

  const token = user.generateToken()

  return res.json({
    user,
    token,
  })
}

const updateUser = async (req, res, next) => {
  const updatingFields = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password']
  const isValid = updatingFields.every((field) =>
    allowedUpdates.includes(field)
  )
  if (!isValid) {
    return next(new HttpError('Invalid updates!', 400))
  }
  updatingFields.forEach((field) => {
    req.user[field] = req.body[field]
  })
  await req.user.save()

  return res.json(req.user)
}

module.exports = {
  signup,
  login,
  updateUser,
}
