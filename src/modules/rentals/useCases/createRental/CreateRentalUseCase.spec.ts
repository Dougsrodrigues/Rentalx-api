import dayjs from 'dayjs';
import faker from 'faker';

import { AppError } from '../../../../shared/errors/AppError';
import { RentalsRepositoryInMemory } from '../../repositories/in-memory/RentalsRepositoryInMemory';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let createRentalUseCase: CreateRentalUseCase;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it('Should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: faker.datatype.string(),
      car_id: faker.datatype.string(),
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('Should not be able to create a new rental if there is another open to the same user', async () => {
    expect(async () => {
      const user_id = faker.datatype.string();

      await createRentalUseCase.execute({
        user_id,
        car_id: faker.datatype.string(),
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id,
        car_id: faker.datatype.string(),
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental if there is another open to the same car', async () => {
    expect(async () => {
      const car_id = faker.datatype.string();

      await createRentalUseCase.execute({
        user_id: faker.datatype.string(),
        car_id,
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: faker.datatype.string(),
        car_id,
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new rental if invalid return time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: faker.datatype.string(),
        car_id: faker.datatype.string(),
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
