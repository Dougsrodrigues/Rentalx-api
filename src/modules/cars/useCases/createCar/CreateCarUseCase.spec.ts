import faker from 'faker';

import { AppError } from '../../../../shared/errors/AppError';
import { CarsRepositoryInMemory } from '../../repositories/inMemory/carsRepositoryInMemory';
import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: faker.datatype.string(),
      description: faker.datatype.string(),
      daily_rate: faker.datatype.number(),
      brand: faker.datatype.string(),
      category_id: faker.datatype.string(),
      fine_amount: faker.datatype.number(),
      license_plate: faker.datatype.string(),
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with license plate exists', () => {
    expect(async () => {
      const license_plate = faker.datatype.string();

      await createCarUseCase.execute({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
        daily_rate: faker.datatype.number(),
        brand: faker.datatype.string(),
        category_id: faker.datatype.string(),
        fine_amount: faker.datatype.number(),
        license_plate,
      });
      await createCarUseCase.execute({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
        daily_rate: faker.datatype.number(),
        brand: faker.datatype.string(),
        category_id: faker.datatype.string(),
        fine_amount: faker.datatype.number(),
        license_plate,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with avaiable true by default', async () => {
    const car = await createCarUseCase.execute({
      name: faker.datatype.string(),
      description: faker.datatype.string(),
      daily_rate: faker.datatype.number(),
      brand: faker.datatype.string(),
      category_id: faker.datatype.string(),
      fine_amount: faker.datatype.number(),
      license_plate: faker.datatype.string(),
    });

    expect(car.available).toBe(true);
  });
});
