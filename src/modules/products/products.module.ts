import { Module } from '@nestjs/common';
import { ProductsController } from './ports/in/products.controller';
import { ProductsService } from './application/products.service';
import { PrismaProductRepository } from './adapters/prisma-products.repository';
import { ProductRepository } from './ports/out/products.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
