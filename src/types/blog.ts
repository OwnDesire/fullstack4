import { Types } from 'mongoose';

interface IBlog {
  title: string,
  author: string,
  url: string,
  likes: number,
  user: Types.ObjectId | Record<string, unknown>,
  comments: string[]
}

interface IBlogComplete extends IBlog {
  id: string;
}

export { IBlog, IBlogComplete };