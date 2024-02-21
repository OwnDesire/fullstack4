import config from './utils/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import blogRouter from './controllers/blogs';
import logger from './utils/logger';

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI!)
  .then(result => logger.info('Connected to MongoDB.'))
  .catch(error => logger.error('Error connecting to MongoDB', error.message));

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);

export default app;