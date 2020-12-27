const ObjectId = require('mongoose').Types.ObjectId

const { User, Task } = require('../../src/models')

const userOneId = new ObjectId()
const userOne = {
  _id: userOneId,
  name: 'one',
  email: 'one@test.com',
  password: '123123',
}

const userTwoId = new ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'two',
  email: 'two@test.com',
  password: '123123',
}

const taskOneId = new ObjectId()
const taskOne = {
  _id: taskOneId,
  description: 'taskOne',
  creator: userOneId,
}
const taskTwoId = new ObjectId()
const taskTwo = {
  _id: taskTwoId,
  description: 'taskTwo',
  creator: userOneId,
}
const taskThreeId = new ObjectId()
const taskThree = {
  _id: taskThreeId,
  description: 'taskOne',
  creator: userTwoId,
}

const setupDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
  await new User(userTwo).save()
  await new Task(taskOne).save()
  await new Task(taskTwo).save()
  await new Task(taskThree).save()
}

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOneId,
  taskOne,
  taskTwoId,
  taskTwo,
  taskThreeId,
  taskThree,
  setupDatabase,
}
