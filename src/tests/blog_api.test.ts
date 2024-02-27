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

test('blogs have the property named "id" as a unique identifier', async () => {
  const response = await api.get('/api/blogs');
  const blog = response.body[0];
  assert('id' in blog);
});

test('a valid blog can be added to the database', async () => {
  const newBlog = {
    title: 'Title 3',
    author: 'Author3',
    url: 'https://address3.com',
    likes: 33
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDB();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map(blog => blog.title);
  assert(titles.includes(newBlog.title));
});

test('"likes" property replaced with 0 if it was missing in request', async () => {
  const newBlog = {
    title: 'Title 4',
    author: 'Author4',
    url: 'https://address4.com'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test.only('return 400 Bad Request if title is missing', async () => {
  const newBlog = {
    author: 'Author5',
    url: 'https://address5.com',
    likes: 55
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test.only('return 400 Bad Request if url is missing', async () => {
  const newBlog = {
    title: 'Title 6',
    author: 'Author6',
    likes: 66
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

after(async () => {
  await mongoose.connection.close();
});