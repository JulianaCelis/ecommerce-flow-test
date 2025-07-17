import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { PrismaModule } from './core/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule],
})
export class AppModule {}
