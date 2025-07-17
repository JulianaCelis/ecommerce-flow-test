// src/modules/customers/adapters/customer.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CustomerRepositoryPort } from '../ports/customer.repository.port';
import { Customer } from '@prisma/client';
import { Result, success, failure } from '../../../shared/types/result.type';
import { AppError, ErrorCode } from '../../../shared/types/app-error.type';
import { CreateCustomerDto, UpdateCustomerDto } from '../dto/customer.dto';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  private readonly logger = new Logger(CustomerRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Result<Customer[], AppError>> {
    try {
      this.logger.log('Fetching all customers');
      const customers = await this.prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      this.logger.log(`Found ${customers.length} customers`);
      return success(customers);
    } catch (error) {
      this.logger.error('Failed to fetch customers:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to fetch customers', error));
    }
  }

  async findById(id: string): Promise<Result<Customer | null, AppError>> {
    try {
      this.logger.log(`Fetching customer by ID: ${id}`);
      const customer = await this.prisma.customer.findUnique({
        where: { id }
      });
      
      this.logger.log(customer ? `Customer found: ${customer.email}` : 'Customer not found');
      return success(customer);
    } catch (error) {
      this.logger.error('Failed to fetch customer by ID:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to fetch customer', error));
    }
  }

  async findByEmail(email: string): Promise<Result<Customer | null, AppError>> {
    try {
      this.logger.log(`Fetching customer by email: ${email}`);
      const customer = await this.prisma.customer.findUnique({
        where: { email: email.toLowerCase() }
      });
      
      this.logger.log(customer ? `Customer found: ${customer.id}` : 'Customer not found');
      return success(customer);
    } catch (error) {
      this.logger.error('Failed to fetch customer by email:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to fetch customer', error));
    }
  }

  async create(customerData: CreateCustomerDto): Promise<Result<Customer, AppError>> {
    try {
      this.logger.log(`Creating customer: ${customerData.email}`);
      
      // Check if customer already exists
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: customerData.email.toLowerCase() }
      });

      if (existingCustomer) {
        this.logger.warn(`Customer already exists: ${customerData.email}`);
        return failure(new AppError(ErrorCode.VALIDATION_ERROR, 'Customer with this email already exists'));
      }

      const customer = await this.prisma.customer.create({
        data: {
          ...customerData,
          email: customerData.email.toLowerCase()
        }
      });
      
      this.logger.log(`Customer created successfully: ${customer.id}`);
      return success(customer);
    } catch (error) {
      this.logger.error('Failed to create customer:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to create customer', error));
    }
  }

  async update(id: string, customerData: UpdateCustomerDto): Promise<Result<Customer, AppError>> {
    try {
      this.logger.log(`Updating customer: ${id}`);
      
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { id }
      });

      if (!existingCustomer) {
        this.logger.warn(`Customer not found for update: ${id}`);
        return failure(new AppError(ErrorCode.NOT_FOUND, 'Customer not found'));
      }

      const customer = await this.prisma.customer.update({
        where: { id },
        data: customerData
      });
      
      this.logger.log(`Customer updated successfully: ${customer.id}`);
      return success(customer);
    } catch (error) {
      this.logger.error('Failed to update customer:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to update customer', error));
    }
  }

  async delete(id: string): Promise<Result<void, AppError>> {
    try {
      this.logger.log(`Deleting customer: ${id}`);
      
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { id }
      });

      if (!existingCustomer) {
        this.logger.warn(`Customer not found for deletion: ${id}`);
        return failure(new AppError(ErrorCode.NOT_FOUND, 'Customer not found'));
      }

      await this.prisma.customer.delete({
        where: { id }
      });
      
      this.logger.log(`Customer deleted successfully: ${id}`);
      return success(undefined);
    } catch (error) {
      this.logger.error('Failed to delete customer:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to delete customer', error));
    }
  }

  async existsByEmail(email: string): Promise<Result<boolean, AppError>> {
    try {
      this.logger.log(`Checking if customer exists by email: ${email}`);
      const customer = await this.prisma.customer.findUnique({
        where: { email: email.toLowerCase() },
        select: { id: true }
      });
      
      const exists = !!customer;
      this.logger.log(`Customer exists: ${exists}`);
      return success(exists);
    } catch (error) {
      this.logger.error('Failed to check customer existence:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to check customer existence', error));
    }
  }
}