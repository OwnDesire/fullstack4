import { Router } from 'express';
import User from '../models/user';
import { hash } from 'bcrypt';
import { CustomValidationError } from '../types/error';

const userRouter = Router();

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  response.json(users);
});

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  // Need to validate if password defined in the controller,
  // because "hash" function does not accept undefined as first argument.
  if (!password) {
    throw new CustomValidationError('Password is missing.');
  }
  // Need to verify password length in the controller,
  // because mongoose may only validate passwordHash.
  if (password.length < 3) {
    throw new CustomValidationError('Password length should be at least 3 characters long.');
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