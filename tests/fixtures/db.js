const mongoose = require('mongoose')

const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'one',
  email: 'one@test.com',
  password: '123123',
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'two',
  email: 'two@test.com',
  password: '123123',
}

const setupDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDatabase,
}
