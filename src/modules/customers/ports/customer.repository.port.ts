// src/modules/customers/ports/customer.repository.port.ts
import { Customer } from '@prisma/client';
import { Result } from '../../../shared/types/result.type';
import { AppError } from '../../../shared/types/app-error.type';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

export interface CustomerRepositoryPort {
  findAll(): Promise<Result<Customer[], AppError>>;
  findById(id: string): Promise<Result<Customer | null, AppError>>;
  findByEmail(email: string): Promise<Result<Customer | null, AppError>>;
  create(customerData: CreateCustomerDto): Promise<Result<Customer, AppError>>;
  update(id: string, customerData: UpdateCustomerDto): Promise<Result<Customer, AppError>>;
  delete(id: string): Promise<Result<void, AppError>>;
  existsByEmail(email: string): Promise<Result<boolean, AppError>>;
}