// src/modules/customers/customers.module.ts
import { Module } from '@nestjs/common';
import { CustomersController } from './ports/in/customers.controller';
import { CustomerRepository } from './adapters/customer.repository';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';

@Module({
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    {
      provide: 'CustomerRepositoryPort', // ← String token
      useClass: CustomerRepository,
    },
  ],
  exports: ['CustomerRepositoryPort'], // ← String token
})
export class CustomersModule {}