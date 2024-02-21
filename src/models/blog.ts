import mongoose from 'mongoose';
import IBlog from '../types/blog';

const blogSchema = new mongoose.Schema<IBlog>({
  title: String,
  author: String,
  url: String,
  likes: Number
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model<IBlog>('Blog', blogSchema);