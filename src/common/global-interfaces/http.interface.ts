import User from '@modules/user/entities/user.entity';
import { Response } from 'express';

export interface IRequestWithUser {
  user?: User;
  res?: Response;
}
