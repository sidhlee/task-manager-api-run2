const express = require('express')
const mongoose = require('mongoose')

const { usersRouter, taskRouter } = require('./routers')

mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to db...')
  }
)

const app = express()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/tasks', taskRouter)

// Handles error thrown before sending response
app.use((err, req, res, next) => {
  // If already sent the response, don't send it again
  if (req.headerSent) {
    console.log(err)
    return next()
  }
  return res.status(err.status || 500).json({
    message: err.message || 'An unknown error occurred!',
  })
})

module.exports = app
