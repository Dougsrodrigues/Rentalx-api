import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/errors/AppError';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlready = await this.categoriesRepository.findByName(name);

    if (categoryAlready) {
      throw new AppError('Category already exists', 400);
    }

    await this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
