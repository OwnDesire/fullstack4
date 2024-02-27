import { Router, response } from "express";
import Blog from "../models/blog";
import { IBlog } from "../types/blog";

const blogRouter = Router();

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body: IBlog = request.body;
  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
  });
  const result = await blog.save();
  response.status(201).json(result);
});

export default blogRouter;