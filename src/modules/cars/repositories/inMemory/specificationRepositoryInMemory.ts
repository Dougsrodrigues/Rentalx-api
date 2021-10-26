import { Specification } from '../../infra/typeorm/entities/Specification';
import {
  ISpecificationRepository,
  ISpecificationRepositoryDTO,
} from '../ISpecificationRepository';

export class SpecificationRepositoryInMemory
  implements ISpecificationRepository
{
  specifications: Specification[] = [];
  // constructor(parameters) {}
  async create({
    name,
    description,
  }: ISpecificationRepositoryDTO): Promise<Specification> {
    const specification = new Specification();

    Object.assign(specification, { name, description });

    this.specifications.push(specification);

    return specification;
  }
  async findByName(name: string): Promise<Specification> {
    return this.specifications.find((spec) => spec.name === name);
  }
  async findByIds(ids: string[]): Promise<Specification[]> {
    return this.specifications.filter((spec) => ids.includes(spec.id));
  }
}
