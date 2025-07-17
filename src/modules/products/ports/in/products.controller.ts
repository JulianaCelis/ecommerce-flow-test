// src/modules/products/ports/in/products.controller.ts - CORREGIDO
import { Body, Controller, Delete, Get, Param, Post, Put, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from '../../application/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all')
  async findAll(@Res() res: Response) {
    const result = await this.productsService.findAll();
    
    // Corregido: usar isSuccess() en lugar de .success
    if (result.isFailure()) {
      return res.status(HttpStatus.NOT_FOUND).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json(result.value); // Corregido: .value en lugar de .data
  }

  @Get('get-by-id/:id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productsService.findById(Number(id));
    
    // Corregido: usar isFailure() en lugar de !result.success
    if (result.isFailure()) {
      return res.status(HttpStatus.NOT_FOUND).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json(result.value); // Corregido: .value en lugar de .data
  }

  @Post()
  async create(
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      image_url: string;
      stock: number;
    },
    @Res() res: Response
  ) {
    const result = await this.productsService.create(body);
    
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.CREATED).json(result.value);
  }

  @Put('update-by-id/:id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: number;
      image_url?: string;
      stock?: number;
    },
    @Res() res: Response
  ) {
    const result = await this.productsService.update(Number(id), body);
    
    if (result.isFailure()) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json(result.value);
  }

  @Delete('delete-by-id/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productsService.delete(Number(id));
    
    if (result.isFailure()) {
      return res.status(HttpStatus.NOT_FOUND).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json({ 
      message: 'Product deleted successfully' 
    });
  }
}