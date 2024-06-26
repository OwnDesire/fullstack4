import { Router } from 'express';
import Blog from '../models/blog';
import { IBlog } from '../types/blog';
import middleware from '../utils/middleware';
import { CustomExpressError, DBNotFoundError } from '../types/error';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, user } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(await savedBlog.populate('user', { username: 1, name: 1 }));
});

blogRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const { comment } = request.body;
  const commentedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $push: { comments: comment } },
    { new: true, runValidators: true, contex: 'query'}
  ).populate('user', { username: 1, name: 1 });

  response.json(commentedBlog);
});

blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes, user, comments } = request.body;
  const blog: IBlog = {
    title,
    author,
    url,
    likes,
    user,
    comments
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' }
  ).populate('user', { username: 1, name: 1 });

  response.json(updatedBlog);
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.body.user;
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    throw new DBNotFoundError('Blog was not found.');
  }

  if (blog.user.toString() !== user._id.toString()) {
    throw new CustomExpressError(403, 'Insufficient permissions.');
  }

  await blog.deleteOne();
  response.status(204).end();
});

export default blogRouter;