import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import { connection } from 'mongoose';
import app from '../app';
import Blog from '../models/blog';
import {initialBlogs, blogsInDB} from './test_helper';

const api = supertest(app);

describe.only('with inititaly saved blogs in database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    for (const blog of initialBlogs) {
      const newBlog = new Blog(blog);
      await newBlog.save();
    }
  });

  describe('getting blogs', () => {
    test('blogs are returned as json with status code 200', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('there is a correct number of blogs', async () => {
      const response = await api.get('/api/blogs');
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test('blogs have the property named "id" as a unique identifier', async () => {
      const response = await api.get('/api/blogs');
      const blog = response.body[0];
      assert('id' in blog);
    });
  });

  describe('adding blogs', () => {
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

      const blogsAtEnd = await blogsInDB();
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);

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

    test('return 400 Bad Request if title is missing', async () => {
      const newBlog = {
        author: 'Author5',
        url: 'https://address5.com',
        likes: 55
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /appliction\/json/);
    });

    test('return 400 Bad Request if url is missing', async () => {
      const newBlog = {
        title: 'Title 6',
        author: 'Author6',
        likes: 66
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /appliction\/json/);
    });
  });

  describe('updating blogs', () => {
    test('blog likes updated by valid id with OK response', async () => {
      const blogsAtStart = await blogsInDB();
      const blogToUpdate = blogsAtStart[0];
      const updatedData = { ...blogToUpdate, likes: 111 };
      await api.put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogsInDB();
      const updatedBlog = blogsAtEnd[0];
      assert.strictEqual(updatedData.likes, updatedBlog.likes);
    });

    test('return 400 Bad Request if the id has invalid format', async () => {
      const invalidId = '123';
      await api.put(`/api/blogs/${invalidId}`)
        .expect(400)
        .expect('Content-Type', /appliction\/json/);
    });
  });

  describe('deleting blogs', () => {
    test('blog deleted by valid id with response status code 204', async () => {
      const blogsAtStart = await blogsInDB();
      const blogToDelete = blogsAtStart[0];
      await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

      const blogsAtEnd = await blogsInDB();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const titles = blogsAtEnd.map(blog => blog.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test('return 400 Bad Request if the id has invalid format', async () => {
      const invalidId = '123';
      await api.delete(`/api/blogs/${invalidId}`)
        .expect(400)
        .expect('Content-Type', /appliction\/json/);
    });
  });

  after(async () => {
    await connection.close();
  });
});