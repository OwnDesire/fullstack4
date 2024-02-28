import { Router } from 'express';
import User from '../models/user';
import { IUser } from '../types/user';
import { hash } from 'bcrypt';

const userRouter = Router();

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
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