import { AppError } from '../../../../shared/errors/AppError';
import { CategoriesRepositoryInMemory } from '../../repositories/inMemory/categoriesRepositoryInMemory';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create Category', () => {
  beforeEach(() => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    createCategoryUseCase = new CreateCategoryUseCase(
      categoriesRepositoryInMemory
    );
  });

  it('Should be able to create a new category', async () => {
    const name = 'any_name';
    const description = 'any_description';

    await createCategoryUseCase.execute({
      name,
      description,
    });

    const categoryCreated = await categoriesRepositoryInMemory.findByName(name);

    expect(categoryCreated).toHaveProperty('id');
  });

  it('Should not be able to create a new category with name exists', async () => {
    expect(async () => {
      const name = 'any_name';
      const description = 'any_description';

      await createCategoryUseCase.execute({
        name,
        description,
      });

      await createCategoryUseCase.execute({
        name,
        description,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
