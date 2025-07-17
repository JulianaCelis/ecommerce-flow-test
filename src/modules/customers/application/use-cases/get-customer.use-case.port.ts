import { Result } from '../../../../shared/types/result.type';
import { AppError } from '../../../../shared/types/app-error.type';
import { CustomerResponseDto } from '../../dto/customer.dto';

export interface GetCustomerUseCasePort {
  executeById(id: string): Promise<Result<CustomerResponseDto, AppError>>;
  executeByEmail(email: string): Promise<Result<CustomerResponseDto, AppError>>;
}