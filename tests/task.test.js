const request = require('supertest')
const orderBy = require('lodash.orderby')
const isEqual = require('lodash.isequal')
const app = require('../src/app')

const {
  setupDatabase,
  userOneId,
  taskOneId,
  taskOne,
  bearerToken,
  taskThreeId,
} = require('./fixtures/db')

beforeEach(setupDatabase)

/* getTaskById */
test('Should get task by id', async () => {
  const response = await request(app)
    .get(`/tasks/${taskOneId}`)
    .set('Authorization', bearerToken)
    .send()
    .expect(200)

  expect(response.body).toMatchObject({
    description: taskOne.description,
    // ObjectId becomes string once it gets sent over http
    _id: taskOne._id.toHexString(),
    creator: userOneId.toHexString(),
  })
})

test('Should not get task by id id if unauthenticated', async () => {
  await request(app).get(`/tasks/${taskOneId}`).send().expect(401)
})

test('Should not get other users task by id', async () => {
  await request(app)
    .get(`/tasks/${taskThreeId}`) // userTwo's task
    .set('Authorization', bearerToken) // userOne's token
    .send()
    .expect(401)
})

/* getUserTasks */
test('Should return two tasks from userOne', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', bearerToken)
    .send()
    .expect(200)

  expect(response.body.tasks.length).toBe(2)
})
test('Should get only completed tasks', async () => {
  const response = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', bearerToken)
    .send()
    .expect(200)

  const { tasks } = response.body
  const onlyCompleted = tasks.reduce(
    (bool, task) => bool && task.completed,
    true
  )
  expect(onlyCompleted).toBe(true)
})
test('Should get sorted tasks', async () => {
  const response = await request(app)
    .get(`/tasks?sort=description_desc`)
    .set('Authorization', bearerToken)
    .send()
    .expect(200)

  const { tasks } = response.body
  const sortedTasks = orderBy(tasks, ['description'], ['desc'])
  expect(isEqual(tasks, sortedTasks)).toBe(true)
})
test('Should get page of tasks', async () => {
  const response = await request(app)
    .get('/tasks?skip=1&limit=2')
    .set('Authorization', bearerToken)
    .send()
    .expect(200)

  expect(response.body.tasks.length).toBe(1)
})

/* createTask */
test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', bearerToken)
    .send({
      description: 'new task',
    })
    .expect(201)

  expect(response.body.task).toMatchObject({
    description: 'new task',
    completed: false,
    creator: userOneId.toString(),
  })
})
test('Should not create task with invalid description', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', bearerToken)
    .send({
      description: '',
    })
    .expect(422)
})

test('Should not create task with invalid completed', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', bearerToken)
    .send({
      description: 'new task',
      completed: 'maybe',
    })
    .expect(422)
})

test('Should have completed field by default', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', bearerToken)
    .send({
      description: 'new task',
    })
    .expect(201)

  expect(response.body.task.completed).toBe(false)
})

/* updateTask */
test('Should not update other users tasks', async () => {
  await request(app)
    .patch(`/tasks/${taskThreeId}`)
    .set('Authorization', bearerToken)
    .send({
      description: 'updated task',
    })
    .expect(401)
})

test('Should not update invalid field', async () => {
  const response = await request(app)
    .patch(`/tasks/${taskOneId}`)
    .set('Authorization', bearerToken)
    .send({
      description: 'updated task',
      priority: 8,
    })
    .expect(200)

  expect(response.body.priority).toBeUndefined()
})

test('Should not update task with invalid description', async () => {
  await request(app)
    .patch(`/tasks/${taskOneId}`)
    .set('Authorization', bearerToken)
    .send({
      description: '',
    })
    .expect(422)
})

test('Should not update task with invalid completed', async () => {
  await request(app)
    .patch(`/tasks/${taskOneId}`)
    .set('Authorization', bearerToken)
    .send({
      description: 'updated task',
      completed: 'maybe',
    })
    .expect(422)
})

/* deleteTask */
test('Should be able to delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskOneId}`)
    .set('Authorization', bearerToken)
    .send()
    .expect(200)
})

test('Should not delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskThreeId}`)
    .set('Authorization', bearerToken)
    .send()
    .expect(401)
})
test('Should not delete task if unauthenticated', async () => {
  await request(app).delete(`/tasks/${taskThreeId}`).send().expect(401)
})
