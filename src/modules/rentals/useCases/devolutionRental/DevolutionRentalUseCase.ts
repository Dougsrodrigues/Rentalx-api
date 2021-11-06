import { inject, injectable } from 'tsyringe';

import { IDayJsProvider } from '../../../../shared/container/providers/DateProvider/IDayJsProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('DayJsDateProvider')
    private dateProvider: IDayJsProvider
  ) {}
  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    const minimum_daily = 1;
    let total = 0;

    if (!rental) throw new AppError('Rental does not exist');

    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compare(rental.start_date, dateNow, 'days');

    if (daily <= 0) daily = minimum_daily;

    const delay = this.dateProvider.compare(
      dateNow,
      rental.expected_return_date,
      'days'
    );

    if (delay > 0) {
      const calculate_fine = delay * car.fine_amount;
      total = calculate_fine;
    }

    total += daily * car.daily_rate;

    rental.end_date = this.dateProvider.dateNow();

    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
