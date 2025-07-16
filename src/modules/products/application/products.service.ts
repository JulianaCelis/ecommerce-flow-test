import { Injectable } from '@nestjs/common';
import { Products } from '../domain/products.entity';
import { ProductRepository } from '../domain/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductRepository) {}

  create(data: Omit<Products, 'id'>) {
    return this.productsRepo.create(data);
  }

  findAll() {
    return this.productsRepo.findAll();
  }

  findById(id: number) {
    return this.productsRepo.findById(id);
  }

  update(id: number, data: Partial<Products>) {
    return this.productsRepo.update(id, data);
  }

  delete(id: number) {
    return this.productsRepo.delete(id);
  }
}
