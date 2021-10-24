import { CarsRepositoryInMemory } from '../../repositories/inMemory/carsRepositoryInMemory';
import { ListCarsUseCase } from './ListCarsUseCase';

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Audi A1',
      description: 'Brabo demais tbm',
      daily_rate: 140.0,
      brand: 'Audi',
      license_plate: 'DAF-1244',
      fine_amount: 100,
      category_id: '0f2f4b79-04b5-496e-acdd-9f492d30844e',
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car3',
      description: 'Brabo demais tbm',
      daily_rate: 140.0,
      brand: 'Car_brand',
      license_plate: 'DAF-1214',
      fine_amount: 100,
      category_id: '0f2f4b79-04b5-496e-acdd-9f492d30844e',
    });

    const cars = await listCarsUseCase.execute({ brand: 'Car_brand' });

    console.log({ cars });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car5',
      description: 'Brabo demais tbm',
      daily_rate: 140.0,
      brand: 'Car_brand',
      license_plate: 'DAF-12141',
      fine_amount: 100,
      category_id: '0f2f4b79-04b5-496e-acdd-9f492d30844e',
    });

    const cars = await listCarsUseCase.execute({ name: 'Car5' });

    console.log({ cars });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car8',
      description: 'Brabo demais tbm',
      daily_rate: 140.0,
      brand: 'Car_brand',
      license_plate: 'DAF-22141',
      fine_amount: 100,
      category_id: '0f2f4b79-04b5-496e-acdd-9f492d30844e',
    });

    const cars = await listCarsUseCase.execute({
      category_id: '0f2f4b79-04b5-496e-acdd-9f492d30844e',
    });

    console.log({ cars });

    expect(cars).toEqual([car]);
  });
});
