import { Schema, Types, model } from 'mongoose';
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: Types.ObjectId,
      ref: 'Blog'
    }
  ]
});

userSchema.set('toJSON', {
  transform: (document, returnedOject) => {
    returnedOject.id = returnedOject._id.toString();
    delete returnedOject._id;
    delete returnedOject.__v;
    delete returnedOject.passwordHash;
  }
});

export default model<IUser>('User', userSchema);