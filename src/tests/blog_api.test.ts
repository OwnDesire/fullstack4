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

test.only('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test.only('there is a correct number of blogs', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});