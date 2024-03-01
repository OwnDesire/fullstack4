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

  response.status(201).json(savedBlog);
});

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;
  // TODO: needs rework concerning user.
  const blog: IBlog = {
    title,
    author,
    url,
    likes,
    user: {}
  };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' }
  )

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