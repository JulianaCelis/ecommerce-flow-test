import { Body, Controller, Delete, Get, Param, Post, Put, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from '../../application/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all')
  async findAll(@Res() res: Response) {
    const result = await this.productsService.findAll();
    
    if (!result.success) {
      return res.status(HttpStatus.NOT_FOUND).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json(result.data);
  }

  @Get('get-by-id/:id')
  async findById(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productsService.findById(Number(id));
    
    if (!result.success) {
      return res.status(HttpStatus.NOT_FOUND).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json(result.data);
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
    
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.CREATED).json(result.data);
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
    
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json(result.data);
  }

  @Delete('delete-by-id/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productsService.delete(Number(id));
    
    if (!result.success) {
      return res.status(HttpStatus.NOT_FOUND).json({ 
        error: result.error 
      });
    }
    
    return res.status(HttpStatus.OK).json({ 
      message: 'Product deleted successfully' 
    });
  }
}