// src/modules/products/application/products.service.ts - ACTUALIZADO
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { Result, success, failure } from '../../../shared/types/result.type';
import { AppError, ErrorCode } from '../../../shared/types/app-error.type';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Result<any[], AppError>> {
    try {
      const products = await this.prisma.product.findMany({ // ← PRODUCT (singular)
        orderBy: { createdAt: 'desc' }
      });
      return success(products);
    } catch (error) {
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to fetch products', error));
    }
  }

  async findById(id: number): Promise<Result<any, AppError>> {
    try {
      const product = await this.prisma.product.findUnique({ // ← PRODUCT (singular)
        where: { id: id.toString() } // Asumiendo que tu ID es string en Prisma
      });
      
      if (!product) {
        return failure(new AppError(ErrorCode.NOT_FOUND, 'Product not found'));
      }
      
      return success(product);
    } catch (error) {
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to fetch product', error));
    }
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    image_url: string;
    stock: number;
  }): Promise<Result<any, AppError>> {
    try {
      const product = await this.prisma.product.create({ // ← PRODUCT (singular)
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.image_url, // Mapear image_url a imageUrl
          stock: data.stock
        }
      });
      return success(product);
    } catch (error) {
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to create product', error));
    }
  }

  async update(id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    stock?: number;
  }): Promise<Result<any, AppError>> {
    try {
      // Verificar si el producto existe
      const existingProduct = await this.prisma.product.findUnique({ // ← PRODUCT (singular)
        where: { id: id.toString() }
      });

      if (!existingProduct) {
        return failure(new AppError(ErrorCode.NOT_FOUND, 'Product not found'));
      }

      const product = await this.prisma.product.update({ // ← PRODUCT (singular)
        where: { id: id.toString() },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.price && { price: data.price }),
          ...(data.image_url && { imageUrl: data.image_url }),
          ...(data.stock !== undefined && { stock: data.stock })
        }
      });
      
      return success(product);
    } catch (error) {
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update product', error));
    }
  }

  async delete(id: number): Promise<Result<void, AppError>> {
    try {
      // Verificar si el producto existe
      const existingProduct = await this.prisma.product.findUnique({ // ← PRODUCT (singular)
        where: { id: id.toString() }
      });

      if (!existingProduct) {
        return failure(new AppError(ErrorCode.NOT_FOUND, 'Product not found'));
      }

      await this.prisma.product.delete({ // ← PRODUCT (singular)
        where: { id: id.toString() }
      });
      
      return success(undefined);
    } catch (error) {
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to delete product', error));
    }
  }
}