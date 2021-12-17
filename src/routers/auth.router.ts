import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import User from '../models/user';
import { StatusCodes } from '../config/status-codes';

const router = Router();

router.post(
  '/login',
  [check('login', 'Enter login'), check('password', 'Enter password').exists()],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(StatusCodes.BadRequest)
          .json({ message: 'Incorrect inputs in form' });
      }

      const { email, login, password } = req.body;
      const user = await User.findOne({ login });
      if (!user) {
        return res
          .status(StatusCodes.BadRequest)
          .json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(StatusCodes.BadRequest)
          .json({ message: 'Password incorrect, try again' });
      }

      res.status(StatusCodes.Ok).json({ userId: user.id });
    } catch (e) {
      res.status(StatusCodes.Error).json({ message: 'Login error' });
    }
  },
);

router.post(
  '/register',
  [
    check('login', 'Wrong login').isLength({ min: 4 }),
    check('password', 'Short password').isLength({ min: 4 }),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(StatusCodes.BadRequest).json({
          errors: errors.array(),
          message: 'Incorrect inputs in registry form. Try again',
        });
      }

      const { email, login, password } = req.body;
      const candidate = await User.findOne({ login });
      if (candidate) {
        return res.status(StatusCodes.BadRequest).json({ message: 'User with same login exists' });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, login, password: hashPassword });
      await user.save();
      return res.status(StatusCodes.Ok).json({ message: 'New user created' });
    } catch (e) {
      res.status(StatusCodes.Error).json({ message: 'Register error' });
    }
  },
);

export default router;
