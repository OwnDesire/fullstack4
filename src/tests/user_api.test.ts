import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import { connection } from 'mongoose';
import app from '../app';
import User from '../models/user';
import { usersInDB } from './test_helper';
import { hash } from 'bcrypt';

const api = supertest(app);

describe.only('with one initial user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await hash('secret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  describe('adding users', () => {
    test('successful creation of user with valid credentials', async () => {
      const usersAtStart = await usersInDB();

      const newUser = {
        username: 'owndesire',
        name: 'Dan Dav',
        password: 'secret'
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDB();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      const userNames = usersAtEnd.map(user => user.username);
      assert(userNames.includes(newUser.username));
    });

    test('error with 400 Bad Request, when trying to create user with already existing userame', async () => {
      const usersAtStart = await usersInDB();

      const newUser = {
        username: 'root',
        name: 'SuperAdmin',
        password: 'secret',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(response.body.error.includes('"username" must be unique'));

      const usersAtEnd = await usersInDB();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('error with 400 Bad Request, when username is missing', async () => {
      const usersAtStart = await usersInDB();

      const newUser = {
        name: 'SuperAdmin',
        password: 'secret'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDB();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('error with 400 Bad Request, when password is missing', async () => {
      const usersAtStart = await usersInDB();

      const newUser = {
        username: 'admin',
        name: 'SuperAdmin'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(response.body.error.includes('Password is missing'));

      const usersAtEnd = await usersInDB();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('error with 400 Bad Request, when username is too short', async () => {
      const usersAtStart = await usersInDB();

      const newUser = {
        username: 'wo',
        name: 'SuperAdmin',
        password: 'secret',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDB();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test('error with 400 Bad Request, when password is too short', async () => {
      const usersAtStart = await usersInDB();

      const newUser = {
        username: 'admin',
        name: 'SuperAdmin',
        password: 'ps',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      assert(response.body.error.includes('Password length should be at least 3 characters long'));

      const usersAtEnd = await usersInDB();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });

  after(async () => {
    await connection.close();
  })
}); 