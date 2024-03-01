import { Types } from 'mongoose';

interface IJWTUserData {
  username: string,
  id: Types.ObjectId;
}

export { IJWTUserData };