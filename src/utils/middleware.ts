import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { verify } from 'jsonwebtoken';
import { IJWTUserData } from '../types/login';
import { CustomExpressError, DBNotFoundError } from '../types/error';
import logger from './logger';

const tokenHandler = (request: Request, response: Response, next: NextFunction): void => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.body.token = authorization.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  const token = request.body.token;
  if (!token) {
    throw new CustomExpressError(401, 'Token is missing.');
  }

  const decodedToken = verify(token, process.env.SECRET!) as IJWTUserData;
  if (!decodedToken.id) {
    throw new CustomExpressError(401, 'Invalid token.');
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new DBNotFoundError('User was not found.');
  }

  request.body.user = user;
  next();
}

const unknownEndpoint = (request: Request, response: Response): void => {
  const message = 'Unknown endpoint.';
  logger.error(message);
  response.status(404).send({ error: message });
}

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction): Response | undefined => {
  logger.error(error.message);
  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'Malformed id.' });
    case 'ValidationError':
    case 'CustomValidationError':
      return response.status(400).json({ error: error.message });
    case 'MongoServerError':
      if (error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: '"username" must be unique.' });
      }
      break;
    case 'DBNotFoundError':
      return response.status(404).json({ error: error.message });
    case 'JsonWebTokenError':
      return response.status(400).json({ error: 'Token is missing or invalid.' });
    case 'TokenExpiredError':
      return response.status(401).json({ error: 'Token expired.' });
    case 'CustomExpressError':
      return response.status((error as CustomExpressError).status).json({ error: error.message });
  }

  next(error);
}

export default { tokenHandler, userExtractor, unknownEndpoint, errorHandler };