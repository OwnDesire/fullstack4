import Blog from "../models/blog";
import { IBlog, IBlogComplete } from '../types/blog';
import User from '../models/user';
import { IUserComplete } from '../types/user';

const initialBlogs: IBlog[] = [
  {
    title: 'Title 1',
    author: 'Author1',
    url: 'https://address1.com',
    likes: 11,
    user: {}
  },
  {
    title: 'Title 2',
    author: 'Author2',
    url: 'https://address2.com',
    likes: 22,
    user: {}
  }
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map<IBlogComplete>(blog => blog.toJSON());
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map<IUserComplete>(user => user.toJSON());
};

export {
  initialBlogs,
  blogsInDB,
  usersInDB
};