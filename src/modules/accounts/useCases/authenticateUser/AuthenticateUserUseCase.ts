import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { authConfigs } from '../../../../config/auth';
import { IDayJsProvider } from '../../../../shared/container/providers/DateProvider/IDayJsProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayJsDateProvider')
    private dateProvider: IDayJsProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    const isPasswordEqual = await compare(password, user.password);

    if (!isPasswordEqual) {
      throw new AppError('Email or password incorrect');
    }

    const token = sign({}, authConfigs.secret_token, {
      subject: user.id,
      expiresIn: authConfigs.expires_in_token,
    });

    const refresh_token = sign(
      {
        email,
      },
      authConfigs.secret_refresh_token,
      {
        subject: user.id,
        expiresIn: authConfigs.expires_in_refresh_token,
      }
    );

    const refresh_token_expiration = this.dateProvider.addDays(
      authConfigs.expires_refresh_token_days
    );

    await this.usersTokensRepository.create({
      user_id: user.id,
      expires_date: refresh_token_expiration,
      refresh_token,
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
      refresh_token,
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
