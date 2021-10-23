import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '../../../dtos/ICreateCarDTO';
import { ICarsRepository } from '../../../repositories/ICarsRepository';
import { Car } from '../entities/Car';

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    name,
    license_plate,
    fine_amount,
    description,
    daily_rate,
    category_id,
    brand,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      name,
      license_plate,
      fine_amount,
      description,
      daily_rate,
      category_id,
      brand,
    });

    await this.repository.save(car);

    return car;
  }
  async findByLicensePlate(licensePlate: string): Promise<Car> {
    const car = await this.repository.findOne({ license_plate: licensePlate });

    return car;
  }
}

export { CarsRepository };
