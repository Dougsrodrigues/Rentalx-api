import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { IDayJsProvider } from '../../../../shared/container/providers/DateProvider/IDayJsProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUsersTokensRepository } from '../../repositories/IUserTokenRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayJsDateProvider')
    private dateProvider: IDayJsProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}
  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (userToken) throw new AppError('Token invalid!');

    if (
      this.dateProvider.compareDate(
        userToken.expires_date,
        this.dateProvider.dateNow(),
        true
      )
    ) {
      throw new AppError('Token expired!');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserUseCase };
