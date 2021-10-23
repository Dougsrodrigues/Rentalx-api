import { NextFunction, Response, Request } from 'express';

import { UsersRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersRepository';
import { AppError } from '../../../errors/AppError';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();

  const findUserById = await usersRepository.findById(id);

  if (!findUserById.isAdmin) {
    throw new AppError('User is not admin');
  }

  return next();
}
