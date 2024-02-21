import { IBlogComplete } from "../types/blog"
// import logger from "./logger";

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
    return (prev && prev.likes > current.likes) ? prev : current
  });

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  };
}

export default { dummy, totalLikes, favouriteBlog };