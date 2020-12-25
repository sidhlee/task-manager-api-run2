const express = require('express')
const mongoose = require('mongoose')

const { usersRouter } = require('./routers/users-router')

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use('/users', usersRouter)

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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to db...')
    app.listen(port, () => {
      console.log(`Server up on port: ${port}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })
