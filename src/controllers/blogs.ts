import { Router } from 'express';
import Blog from '../models/blog';
import { IBlog } from '../types/blog';
import User from '../models/user';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  // TODO: Reuqire refactoring (especially user usage).
  const { title, author, url, likes } = request.body;
  const user = await User.findOne({ username: 'root' });
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user?.id
  });

  const savedBlog = await blog.save();
  user!.blogs = user!.blogs.concat(savedBlog._id);
  await user?.save();

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
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

export default blogRouter;