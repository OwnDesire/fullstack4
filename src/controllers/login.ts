import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import User from '../models/user';
import { IJWTUserData } from '../types/login';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const isPasswordCorrect = user !== null
    ? await compare(password, user.passwordHash)
    : false;
  // Considering above code, only isPasswordCorrect may be used for check.
  if (!(user && isPasswordCorrect)) {
    return response.status(401).json({ error: 'Invalid username or password.' });
  }

  const dataForToken: IJWTUserData = {
    username: user.username,
    id: user._id
  };
  // Secret type does not allowed to be undefined.
  const token = sign(dataForToken, process.env.SECRET!);
  response.status(200).send({ token, username: user.username, name: user.name });
});

export default loginRouter;

