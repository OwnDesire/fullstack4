import { Request, Response, NextFunction } from 'express';
import logger from "./logger";


const unknownEndpoint = (request: Request, response: Response) => {
  const message = 'Unknown endpoint.';
  logger.error(message);
  response.status(404).send({ error: message });
}

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message);
  switch (error.name) {
    case 'CastError':
      return response.status(400).send({ error: 'Malformed id.' });
    case 'ValidationError':
    case 'InvalidNumber':
      return response.status(400).json({ error: error.message });
  }

  next(error);
}

export default { unknownEndpoint, errorHandler };