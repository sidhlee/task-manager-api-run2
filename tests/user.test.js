const request = require('supertest')
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  bearerToken,
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

test('Should get profile for authenticated user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', bearerToken)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401)
})

// PATCH: /me
test('Should update valid user fields', async () => {
  const updates = {
    name: 'updated',
    email: 'updated@test.com',
    password: '321321',
  }
  await request(app)
    .patch('/users/me')
    .set('Authorization', bearerToken)
    .send(updates)
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toMatchObject({
    name: updates.name,
    email: updates.email,
    // password is not returned
  })
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', bearerToken)
    .send({ 'invalid field': 'invalid value' })
    .expect(422)
})

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({ description: 'valid update' })
    .expect(401)
})

test('Should not update user with invalid name', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', bearerToken)
    .send({ name: '' })
    .expect(422)
})

test('Should not update user with invalid email', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', bearerToken)
    .send({ email: ' email ' })
    .expect(422)
})

test('SHould not update user with invalid password', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', bearerToken)
    .send({ password: ' 333 22' })
    .expect(422)
})

// DELETE: /me
test('Should delete user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', bearerToken)
    .send()
    .expect(200)

  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401)

  const user = await User.findById(userOneId)
  expect(user).not.toBeNull()
})

// POST: /me/avatar
test('Should upload avatar image', () => {})
test('Should get avatar image', () => {})
test('Should delete avatar image', () => {})
