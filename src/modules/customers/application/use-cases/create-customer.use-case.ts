// src/modules/customers/application/use-cases/create-customer.use-case.ts
import { Injectable, Logger, Inject } from '@nestjs/common'; // ← AGREGAR Inject
import { CustomerRepositoryPort } from '../../ports/customer.repository.port';
import { Result, success, failure } from '../../../../shared/types/result.type';
import { AppError, ErrorCode } from '../../../../shared/types/app-error.type';
import { CreateCustomerDto, CustomerResponseDto } from '../../dto/customer.dto';

@Injectable()
export class CreateCustomerUseCase {
  private readonly logger = new Logger(CreateCustomerUseCase.name);

  constructor(
    @Inject('CustomerRepositoryPort') // ← USAR @Inject con string token
    private readonly customerRepository: CustomerRepositoryPort
  ) {}

  async execute(customerData: CreateCustomerDto): Promise<Result<CustomerResponseDto, AppError>> {
    this.logger.log(`Creating customer: ${customerData.email}`);

    return this.validateEmailUniqueness(customerData.email)
      .then(result => result.isSuccess() ? this.createCustomer(customerData) : Promise.resolve(result))
      .then(result => result.isSuccess() ? this.mapToResponseDto(result.value) : Promise.resolve(result));
  }

  private async validateEmailUniqueness(email: string): Promise<Result<string, AppError>> {
    try {
      const existsResult = await this.customerRepository.existsByEmail(email);
      
      if (existsResult.isFailure()) {
        return failure(existsResult.error);
      }

      if (existsResult.value) {
        this.logger.warn(`Email already exists: ${email}`);
        return failure(new AppError(
          ErrorCode.VALIDATION_ERROR, 
          'A customer with this email already exists'
        ));
      }

      return success(email);
    } catch (error) {
      this.logger.error('Email validation failed:', error);
      return failure(new AppError(ErrorCode.VALIDATION_ERROR, 'Email validation failed', error));
    }
  }

  private async createCustomer(customerData: CreateCustomerDto): Promise<Result<any, AppError>> {
    const customerResult = await this.customerRepository.create(customerData);
    
    if (customerResult.isFailure()) {
      this.logger.error('Customer creation failed:', customerResult.error);
      return failure(customerResult.error);
    }

    this.logger.log(`Customer created successfully: ${customerResult.value.id}`);
    return success(customerResult.value);
  }

  private async mapToResponseDto(customer: any): Promise<Result<CustomerResponseDto, AppError>> {
    try {
      const responseDto: CustomerResponseDto = {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        fullName: `${customer.firstName} ${customer.lastName}`
      };

      return success(responseDto);
    } catch (error) {
      this.logger.error('Failed to map customer to response DTO:', error);
      return failure(new AppError(ErrorCode.INTERNAL_ERROR, 'Failed to process customer data', error));
    }
  }
}