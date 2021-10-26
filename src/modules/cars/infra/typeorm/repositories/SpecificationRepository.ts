import { getRepository, Repository } from 'typeorm';

import {
  ISpecificationRepository,
  ISpecificationRepositoryDTO,
} from '../../../repositories/ISpecificationRepository';
import { Specification } from '../entities/Specification';

class SpecificationRepository implements ISpecificationRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async create({
    name,
    description,
  }: ISpecificationRepositoryDTO): Promise<Specification> {
    const specification = this.repository.create({
      name,
      description,
    });

    await this.repository.save(specification);

    return specification;
  }

  findByName(name: string): Promise<Specification> {
    const specification = this.repository.findOne({ name });

    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const spefications = await this.repository.findByIds(ids);

    return spefications;
  }
}

export { SpecificationRepository };
