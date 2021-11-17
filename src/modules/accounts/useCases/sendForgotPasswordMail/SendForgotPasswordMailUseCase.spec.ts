import faker from 'faker';

import { DayJsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { MailProviderInMemory } from '../../../../shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '../../../../shared/errors/AppError';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '../../repositories/inMemory/UsersTokensRepositoryInMemory';
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe('SendForgotPasswordMailUseCase', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it('Should send to send a forgot password mail to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    const email = faker.internet.email();

    await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email,
      password: faker.internet.password(),
      driver_license: faker.datatype.string(),
      avatar: faker.image.avatar(),
      id: faker.datatype.uuid(),
    });

    await sendForgotPasswordMailUseCase.execute(email);

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not send to send a forgot password mail to user if it does not exist', async () => {
    const email = faker.internet.email();

    expect(await sendForgotPasswordMailUseCase.execute(email)).rejects.toEqual(
      new AppError('User does not exist!')
    );
  });

  it('Should be able to create an users token', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create');
    const email = faker.internet.email();
    await usersRepositoryInMemory.create({
      name: faker.name.findName(),
      email,
      password: faker.internet.password(),
      driver_license: faker.datatype.string(),
      avatar: faker.image.avatar(),
      id: faker.datatype.uuid(),
    });

    await sendForgotPasswordMailUseCase.execute(email);

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
