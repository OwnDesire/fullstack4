import { IBlogComplete } from "../types/blog"

const dummy = (blogs: IBlogComplete[]): number => {
  return 1;
}

const totalLikes = (blogs: IBlogComplete[]): number => {
  return blogs.reduce((sum, current) => sum + current.likes, 0);
}

export default { dummy, totalLikes };