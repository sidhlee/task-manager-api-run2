const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(v) {
        if (!validator.isEmail(v)) {
          throw new Error('Email is invalid.')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(v) {
        const hasSpace = /\s/.test(v)
        const hasThreeRepeatedCharacters = /([\s\S])\1\1/
        if (hasSpace) {
          throw new Error('Password cannot contain space.')
        }
        if (hasThreeRepeatedCharacters) {
          throw new Error(
            'Password cannot contain more than 3 repeated characters.'
          )
        }
      },
    },
    tokens: [String],
    avatar: {
      type: Buffer,
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function () {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  // you don't need to call next() if your function returns a Promise
})

module.exports = mongoose.model('User', userSchema)
