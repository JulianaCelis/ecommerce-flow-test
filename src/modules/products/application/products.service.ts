import { Injectable } from '@nestjs/common';
import { Products } from '../domain/products.entity';
import { ProductRepository } from '../ports/out/products.repository';
import { Result } from '../../../shared/types/result.type'; // Ajusta la ruta según tu estructura

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepo: ProductRepository) {}

  async create(data: Omit<Products, 'id'>): Promise<Result<Products, string>> {
    try {
      if (!data.name || !data.price) {
        return { success: false, error: 'Name and price are required' };
      }

      if (data.price <= 0) {
        return { success: false, error: 'Price must be greater than 0' };
      }

      if (data.stock < 0) {
        return { success: false, error: 'Stock cannot be negative' };
      }

      const product = await this.productsRepo.create(data);
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: 'Failed to create product' };
    }
  }

  async findAll(): Promise<Result<Products[], string>> {
    try {
      const products = await this.productsRepo.findAll();
      
      if (!products || products.length === 0) {
        return { success: false, error: 'No products found' };
      }
      
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: 'Failed to fetch products' };
    }
  }

  async findById(id: number): Promise<Result<Products, string>> {
    try {
      if (!id || id <= 0) {
        return { success: false, error: 'Invalid product ID' };
      }

      const product = await this.productsRepo.findById(id);
      
      if (!product) {
        return { success: false, error: `Product with ID ${id} not found` };
      }
      
      return { success: true, data: product };
    } catch (error) {
      return { success: false, error: 'Failed to fetch product' };
    }
  }

  async update(id: number, data: Partial<Products>): Promise<Result<Products, string>> {
    try {
      if (!id || id <= 0) {
        return { success: false, error: 'Invalid product ID' };
      }

      if (data.price !== undefined && data.price <= 0) {
        return { success: false, error: 'Price must be greater than 0' };
      }

      if (data.stock !== undefined && data.stock < 0) {
        return { success: false, error: 'Stock cannot be negative' };
      }

      const existingProduct = await this.productsRepo.findById(id);
      if (!existingProduct) {
        return { success: false, error: `Product with ID ${id} not found` };
      }

      const updatedProduct = await this.productsRepo.update(id, data);
      return { success: true, data: updatedProduct };
    } catch (error) {
      return { success: false, error: 'Failed to update product' };
    }
  }

  async delete(id: number): Promise<Result<boolean, string>> {
    try {
      if (!id || id <= 0) {
        return { success: false, error: 'Invalid product ID' };
      }

      const existingProduct = await this.productsRepo.findById(id);
      if (!existingProduct) {
        return { success: false, error: `Product with ID ${id} not found` };
      }

      await this.productsRepo.delete(id);
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete product' };
    }
  }
}