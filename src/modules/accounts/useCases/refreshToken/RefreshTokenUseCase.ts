import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { authConfigs } from '../../../../config/auth';
import { IDayJsProvider } from '../../../../shared/container/providers/DateProvider/IDayJsProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersTokensRepository } from '../../repositories/IUserTokenRepository';

type IPayload = {
  sub: string;
  email: string;
};

interface ITokenResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersTokenRepository')
    private usersTokenRepository: IUsersTokensRepository,
    @inject('DayJsDateProvider')
    private dateProvider: IDayJsProvider
  ) {}
  async execute(token: string): Promise<ITokenResponse> {
    const { sub, email } = verify(
      token,
      authConfigs.secret_refresh_token
    ) as IPayload;

    const user_id = sub;

    const userToken =
      await this.usersTokenRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userToken) throw new AppError('Refresh token does not exist');

    await this.usersTokenRepository.deleteById(userToken.id);

    const expires_date = this.dateProvider.addDays(
      authConfigs.expires_refresh_token_days
    );

    const refresh_token = sign(
      {
        email,
      },
      authConfigs.secret_refresh_token,
      {
        subject: sub,
        expiresIn: authConfigs.expires_in_refresh_token,
      }
    );

    await this.usersTokenRepository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    const newToken = sign({}, authConfigs.secret_token, {
      subject: user_id,
      expiresIn: authConfigs.expires_in_token,
    });

    return { token: newToken, refresh_token };
  }
}

export { RefreshTokenUseCase };
