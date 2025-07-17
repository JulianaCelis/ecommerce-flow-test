// src/modules/customers/ports/in/customers.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpStatus, 
  HttpException,
  Logger,
  Inject // ← AGREGAR
} from '@nestjs/common';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { CustomerRepositoryPort } from '../../ports/customer.repository.port';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto } from '../../dto/customer.dto';
import { AppError, ErrorCode } from '../../../../shared/types/app-error.type';

@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    @Inject('CustomerRepositoryPort') // ← USAR @Inject con string token
    private readonly customerRepository: CustomerRepositoryPort
  ) {}

  @Get()
  async getCustomers() {
    const result = await this.customerRepository.findAll();
    
    if (result.isFailure()) {
      throw this.handleError(result.error);
    }

    return {
      success: true,
      data: result.value.map(customer => ({
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        fullName: `${customer.firstName} ${customer.lastName}`
      })),
      message: 'Customers retrieved successfully',
      count: result.value.length
    };
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    const result = await this.customerRepository.findById(id);
    
    if (result.isFailure()) {
      throw this.handleError(result.error);
    }

    if (!result.value) {
      throw new HttpException({
        success: false,
        error: 'NOT_FOUND',
        message: 'Customer not found'
      }, HttpStatus.NOT_FOUND);
    }

    const customer = result.value;
    return {
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        fullName: `${customer.firstName} ${customer.lastName}`
      },
      message: 'Customer retrieved successfully'
    };
  }

  @Get('by-email/:email')
  async getCustomerByEmail(@Param('email') email: string) {
    const result = await this.customerRepository.findByEmail(email);
    
    if (result.isFailure()) {
      throw this.handleError(result.error);
    }

    if (!result.value) {
      throw new HttpException({
        success: false,
        error: 'NOT_FOUND',
        message: 'Customer not found'
      }, HttpStatus.NOT_FOUND);
    }

    const customer = result.value;
    return {
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        fullName: `${customer.firstName} ${customer.lastName}`
      },
      message: 'Customer retrieved successfully'
    };
  }

  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const result = await this.createCustomerUseCase.execute(createCustomerDto);
    
    if (result.isFailure()) {
      throw this.handleError(result.error);
    }

    return {
      success: true,
      data: result.value,
      message: 'Customer created successfully'
    };
  }

  @Put(':id')
  async updateCustomer(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const result = await this.customerRepository.update(id, updateCustomerDto);
    
    if (result.isFailure()) {
      throw this.handleError(result.error);
    }

    const customer = result.value;
    return {
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        fullName: `${customer.firstName} ${customer.lastName}`
      },
      message: 'Customer updated successfully'
    };
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    const result = await this.customerRepository.delete(id);
    
    if (result.isFailure()) {
      throw this.handleError(result.error);
    }

    return {
      success: true,
      message: 'Customer deleted successfully'
    };
  }

  private handleError(error: AppError) {
    this.logger.error('Controller error:', error);
    
    const statusMap = {
      'NOT_FOUND': HttpStatus.NOT_FOUND,
      'VALIDATION_ERROR': HttpStatus.BAD_REQUEST,
      'INSUFFICIENT_STOCK': HttpStatus.BAD_REQUEST,
      'INTERNAL_ERROR': HttpStatus.INTERNAL_SERVER_ERROR
    };

    const status = statusMap[error.code] || HttpStatus.INTERNAL_SERVER_ERROR;
    
    throw new HttpException({
      success: false,
      error: error.code,
      message: error.message,
      details: error.details
    }, status);
  }
}