const request = require('supertest')
const { setupDatabase } = require('./fixtures/db')
const app = require('../src/app')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users/signup')
    .send({
      name: 'test',
      email: 'test@test.com',
      password: '123123',
    })
    .expect(201)
})
