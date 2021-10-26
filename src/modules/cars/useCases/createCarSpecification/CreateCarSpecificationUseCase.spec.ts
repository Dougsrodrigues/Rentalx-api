import faker from 'faker';

import { AppError } from '../../../../shared/errors/AppError';
import { CarsRepositoryInMemory } from '../../repositories/inMemory/carsRepositoryInMemory';
import { SpecificationRepositoryInMemory } from '../../repositories/inMemory/specificationRepositoryInMemory';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    specificationsRepositoryInMemory = new SpecificationRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    );
  });

  it('should not be able to add a new specification to a now-existent car', async () => {
    expect(async () => {
      const car_id = faker.datatype.string();
      const specification_id = [faker.datatype.string()];

      await createCarSpecificationUseCase.execute({ car_id, specification_id });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: faker.datatype.string(),
      description: faker.datatype.string(),
      daily_rate: faker.datatype.number(),
      brand: faker.datatype.string(),
      category_id: faker.datatype.string(),
      fine_amount: faker.datatype.number(),
      license_plate: faker.datatype.string(),
    });

    const specification = await specificationsRepositoryInMemory.create({
      description: faker.datatype.string(),
      name: faker.datatype.string(),
    });

    const specification_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specification_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
});
