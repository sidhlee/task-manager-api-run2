const mongoose = require('mongoose')

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamp: true,
  }
)

taskSchema.methods.toJSON = function () {
  const task = this
  const taskObject = task.toObject({ getters: true })

  return taskObject
}

module.exports = mongoose.model('Task', taskSchema)
