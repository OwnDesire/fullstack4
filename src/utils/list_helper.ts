import { IBlogComplete } from "../types/blog";
import _ from 'lodash';
import logger from "./logger";

const dummy = (blogs: IBlogComplete[]): number => {
  return 1;
}

const totalLikes = (blogs: IBlogComplete[]): number => {
  return blogs.reduce((sum, current) => sum + current.likes, 0);
}

const favouriteBlog = (blogs: IBlogComplete[]): Pick<IBlogComplete, 'title' | 'author' | 'likes'> | null => {
  if (blogs.length === 0) {
    return null;
  }

  const favourite = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  });

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  };
}

const mostBlogs = (blogs: IBlogComplete[]): { author: string, blogs: number } | null => {
  if (blogs.length === 0) {
    return null;
  }

  const countsByAuthor = _.countBy(blogs, 'author');
  const mostBlogsAuthor = Object.entries(countsByAuthor).reduce((prev, current) => {
    return prev[1] > current[1] ? prev : current;
  });
  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1]
  };
}

const mostLikes = (blogs: IBlogComplete[]): { author: string, likes: number } | null => {
  if (blogs.length === 0) {
    return null;
  }

  const groupsByAuthor = _.groupBy(blogs, 'author');
  const authorsLikes = Object.fromEntries(
    Object.entries(groupsByAuthor).map(([key, arr]) => [key, totalLikes(arr)])
  );
  logger.info(authorsLikes);
  const mostLikesAuthor = Object.entries(authorsLikes).reduce((prev, current) => {
    return prev[1] > current[1] ? prev : current;
  });
  logger.info(mostLikesAuthor);
  return {
    author: mostLikesAuthor[0],
    likes: mostLikesAuthor[1]
  };
}

export default { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };