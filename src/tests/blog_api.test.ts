import { test, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Blog from '../models/blog';
import helper from './blog_test_helper';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blog of helper.initialBlogs) {
    const newBlog = new Blog(blog);
    await newBlog.save();
  }
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there is a correct number of blogs', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test.only('blogs have the property named "id" as a unique identifier', async () => {
  const response = await api.get('/api/blogs');
  const blog = response.body[0];
  assert('id' in blog);
});

after(async () => {
  await mongoose.connection.close();
});