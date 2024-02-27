import Blog from "../models/blog";
import { IBlog } from '../types/blog';

const initialBlogs: IBlog[] = [
  {
    title: 'Title 1',
    author: 'Author1',
    url: 'https://address1.com',
    likes: 11
  },
  {
    title: 'Title 2',
    author: 'Author2',
    url: 'https://address2.com',
    likes: 22
  }
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

export default { initialBlogs, blogsInDB };