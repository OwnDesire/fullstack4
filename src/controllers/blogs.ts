import { Router } from 'express';
import Blog from '../models/blog';
import { IBlog } from '../types/blog';

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  });

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;
  // temp
  // const blog: IBlog = {
  //   title,
  //   author,
  //   url,
  //   likes
  // };
  const blog = {}

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