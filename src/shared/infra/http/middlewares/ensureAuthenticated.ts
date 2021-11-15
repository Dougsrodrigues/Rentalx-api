import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfigs } from '../../../../config/auth';
import { UsersTokensRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import { AppError } from '../../../errors/AppError';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  const userTokensRepository = new UsersTokensRepository();

  if (!authHeader) throw new AppError('Token missing', 401);

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(
      token,
      authConfigs.secret_refresh_token
    ) as IPayload;

    const user = userTokensRepository.findByUserIdAndRefreshToken(
      userId,
      token
    );

    if (!user) {
      throw new AppError('Users does not exists', 401);
    }

    request.user = {
      id: userId,
    };

    next();
  } catch (error) {
    throw new AppError('Invalid token', 401);
  }
}
