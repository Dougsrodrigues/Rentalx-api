import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/errors/AppError';
import { Car } from '../../infra/typeorm/entities/Car';
import { Specification } from '../../infra/typeorm/entities/Specification';
import { ICarsRepository } from '../../repositories/ICarsRepository';
import { ISpecificationRepository } from '../../repositories/ISpecificationRepository';

interface IRequest {
  car_id: string;
  specification_id: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}
  async execute({ car_id, specification_id }: IRequest): Promise<Car> {
    const hasCar = await this.carsRepository.findById(car_id);

    if (!hasCar) throw new AppError('Car does not exist');

    const specifications = await this.specificationRepository.findByIds(
      specification_id
    );

    hasCar.specifications = specifications;

    await this.carsRepository.create(hasCar);

    return hasCar;
  }
}

export { CreateCarSpecificationUseCase };
