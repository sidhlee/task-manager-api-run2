const request = require('supertest')
const app = require('../src/app')
const { Task, User } = require('../src/models')
const { setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

/* getTaskById */
test('Should get task by id')
test('Should not get task by id id if unauthenticated')
test('Should not get other users task by id')

/* getUserTasks */
test('Should return two tasks from userOne')
test('Should get only completed tasks')
test('Should get sorted tasks')
test('Should get page of tasks')

/* createTask */
test('Should create task for user')
test('Should not create task with invalid description')
test('Should not create task with invalid completed')

/* updateTask */
test('Should not update other users tasks')
test('Should not update invalid field')
test('Should not update task with invalid description')
test('Should not update task with invalid completed')

/* deleteTask */
test('Should not delete other users tasks')
test('Should be able to delete user task')
test('Should not delete task if unauthenticated')
