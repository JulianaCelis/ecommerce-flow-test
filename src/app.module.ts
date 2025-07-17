// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    CustomersModule,
  ],
})
export class AppModule {}