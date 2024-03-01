import config from './utils/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import mongoose from 'mongoose';
import blogRouter from './controllers/blogs';
import userRouter from './controllers/users';
import loginRouter from './controllers/login';
import middleware from './utils/middleware';
import logger from './utils/logger';


const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI!)
  .then(result => logger.info('Connected to MongoDB.'))
  .catch(error => logger.error('Error connecting to MongoDB', error.message));

app.use(cors());
app.use(express.json());
app.use(middleware.tokenHandler);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;