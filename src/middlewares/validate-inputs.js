const { validationResult } = require('express-validator')
const { HttpError } = require('../models')

module.exports = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs were passed.', 422))
  }
  return next()
}
