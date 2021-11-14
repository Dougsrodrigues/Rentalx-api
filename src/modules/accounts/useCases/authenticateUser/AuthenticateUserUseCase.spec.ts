// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: 'any_driver_license',
      email: 'any_email',
      password: 'any_password',
      name: 'any_name',
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('Should not be able authenticate an nonexistent user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'other_email',
        password: 'other_password',
      })
    ).rejects.toEqual(new AppError('User not found'));
  });

  it('Should not be able authenticate if wrong password', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: faker.datatype.string(),
        email: faker.datatype.string(),
        password: faker.datatype.string(),
        name: faker.datatype.string(),
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: faker.datatype.string(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able authenticate if wrong email', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: faker.datatype.string(),
        email: faker.datatype.string(),
        password: faker.datatype.string(),
        name: faker.datatype.string(),
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: faker.datatype.string(),
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
