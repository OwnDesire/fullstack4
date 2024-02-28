import { Router } from 'express';
import User from '../models/user';
import { IUser } from '../types/user';
import { hash } from 'bcrypt';

const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  // Need to validate if  password defined in the controller,
  // because "hash" function does not accept undefined as first argument.
  if (!password) {
    response.status(400).json({
      error: 'Password is missing.'
    });
  }
  // Need to verify password length in the controller,
  // because mongoose may only validate passwordHash.
  if (password.length < 3) {
    response.status(400).json({
      error: 'Password length should be at least 3 characters long.'
    });
  }

  const SALTROUNDS = 10;
  const passwordHash = await hash(password, SALTROUNDS);
  const user = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

export default userRouter;