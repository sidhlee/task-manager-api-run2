const express = require('express')
const mongoose = require('mongoose')

const app = express()

const port = process.env.PORT || 5000

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
