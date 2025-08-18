import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  public async getCategories(): Promise<Category[]> {
    return await this.find();
  }

  public async getCategoryById(id: string): Promise<Category | null> {
    return await this.findOne({ where: { id: id } });
  }
  public async getCategoryByName(name: string): Promise<Category | null> {
    return await this.findOne({ where: { name: name } });
  }
  public async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await this.findOne({ where: { slug: slug } });
  }
public async getAllCategoriesByNameCaseInsensitive(name: string): Promise<Category[]> {
  return this.createQueryBuilder('category')
    .where('category.name ILIKE :name', { name })
    .getMany();
}

  public async createCategory(
    categoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.create(categoryDto);
    await this.save(category);
    return category;
  }
  public async updateCategory(
    category: Category,
    categoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updated = Object.assign(category, categoryDto);
    await this.save(updated);
    return updated;
  }

  public async deleteCategory(id: string) {
    await this.delete(id);
    return {
      status: 200,
      message: 'Ok',
    };
  }
}
