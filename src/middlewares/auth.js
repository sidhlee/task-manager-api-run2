const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')
const User = require('../models/user')

const auth = async (req, res, next) => {
  // let through preflight request
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) throw new Error()

    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(id)
    if (!user) throw new Error()

    req.user = user

    return next()
  } catch (err) {
    return next(new HttpError('Authentication failed!', 401))
  }
}

module.exports = { auth }
