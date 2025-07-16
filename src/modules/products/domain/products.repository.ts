import { Products } from './products.entity';

export abstract class ProductRepository {
  abstract create(product: Omit<Products, 'id'>): Promise<Products>;
  abstract findAll(): Promise<Products[]>;
  abstract findById(id: number): Promise<Products | null>;
  abstract update(id: number, product: Partial<Products>): Promise<Products>;
  abstract delete(id: number): Promise<void>;
}
