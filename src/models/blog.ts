import { Schema, Types, model } from 'mongoose';
import { IBlog } from '../types/blog';

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: Types.ObjectId,
    ref: 'User'
  }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default model<IBlog>('Blog', blogSchema);