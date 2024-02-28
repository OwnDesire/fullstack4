import { Types } from 'mongoose';

interface IUser {
  username: string,
  name: string,
  passwordHash: string,
  blogs: (Types.ObjectId | Record<string, unknown>)[];
}

interface IUserComplete extends IUser {
  id: string;
}

export { IUser, IUserComplete };