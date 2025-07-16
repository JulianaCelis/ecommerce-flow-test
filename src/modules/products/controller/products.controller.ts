import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from '../application/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('get-all')
  findAll() {
    return this.productsService.findAll();
  }

  @Get('get-by-id/:id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(Number(id));
  }

  @Put('update-by-id/:id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; price?: number; image_url?: string },
  ) {
    return this.productsService.update(Number(id), body);
  }

  @Delete('delete-by-id/:id')
  delete(@Param('id') id: string) {
    return this.productsService.delete(Number(id));
  }
}
