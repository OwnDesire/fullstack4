import { Router } from 'express';
import { verify } from 'jsonwebtoken';
import Blog from '../models/blog';
import { IBlog } from '../types/blog';
import User from '../models/user';
import { IJWTUserData } from '../types/login';
import { CustomExpressError, DBNotFoundError } from '../types/error';
// TODO: Revise if it should be moved to another file and if logic shoud be separated.
const tokenDecoder = (token: string): IJWTUserData => {
  if (!token) {
    throw new CustomExpressError(401, 'Token is missing.');
  }

  const decodedToken = verify(token, process.env.SECRET!) as IJWTUserData;
  if (!decodedToken.id) {
    throw new CustomExpressError(401, 'Invalid token.');
  }

  return decodedToken;
};

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes, token } = request.body;
  const decodedToken = tokenDecoder(token);
  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new DBNotFoundError('User was not found.');
  }

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

blogRouter.delete('/:id', async (request, response) => {
  const { token } = request.body;
  const decodedToken = tokenDecoder(token);
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    throw new DBNotFoundError('Blog was not found.');
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    throw new CustomExpressError(403, 'Insufficient permissions.');
  }

  await blog.deleteOne();
  response.status(204).end();
});

export default blogRouter;