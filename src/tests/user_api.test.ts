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

  test.only('successful creation of user with valid credentials', async () => {
    const usersAtStart = await usersInDB();

    const newUser = {
      username: 'owndesire',
      name: 'Dan Dav',
      password: 'erised'
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

  after(async () => {
    await connection.close();
  })
}); 