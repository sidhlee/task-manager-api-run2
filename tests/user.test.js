const request = require('supertest')
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  setupDatabase,
} = require('./fixtures/db')
const app = require('../src/app')
const { User } = require('../src/models')

beforeEach(setupDatabase)

// POST: /signup

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users/signup')
    .send({
      name: 'test',
      email: 'test@test.com',
      password: '123123',
    })
    .expect(201)

  const user = await User.findOne({ email: 'test@test.com' })

  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: { name: 'test', email: 'test@test.com' },
  })

  expect(response.body.token.length).toBeGreaterThan(10)
})

test('Should not signup with invalid name', async () => {
  await request(app)
    .post('/users/signup')
    .send({
      name: '',
      email: 'abc@test.com',
      password: '123123',
    })
    .expect(422)
})

test('Should not signup with invalid email', async () => {
  await request(app)
    .post('/users/signup')
    .send({
      name: 'John',
      email: 'abc',
      password: '123123',
    })
    .expect(422)
})

test('Should not signup with invalid password', () => {})

// POST: /login

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200)

  expect(response.body.user).toMatchObject({
    _id: userOneId.toHexString(),
    name: userOne.name,
    email: userOne.email,
  })

  expect(response.body.token.length).toBeGreaterThan(10)
})

test('Should not login with wrong password', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'wrongpassword!',
    })
    .expect(422)
})

// GET: /me

test('Should get profile for authenticated user', () => {})

test('Should not get profile for unauthenticated user', () => {})

// PATCH: /me
test('Should update valid user fields', () => {})

test('Should not update invalid user fields', () => {})

test('Should not update user if unauthenticated', () => {})

test('Should not update user with invalid name', () => {})

test('Should not update user with invalid email', () => {})

test('SHould not update user with invalid password', () => {})

// DELETE: /me
test('Should delete user', () => {})

test('Should not delete unauthenticated user', () => {})

// POST: /me/avatar
test('Should upload avatar image', () => {})
