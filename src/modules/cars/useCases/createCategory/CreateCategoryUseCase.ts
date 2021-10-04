import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

class CreateCategoryUseCase {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  execute({ name, description }: IRequest): void {
    const categoryAlready = this.categoriesRepository.findByName(name);

    if (categoryAlready) {
      throw new Error('Category already exists');
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };