import { Injectable } from '@nestjs/common';
import { Products } from '../domain/products.entity';
import { ProductRepository } from '../domain/products.repository';
import { PrismaService } from 'src/core/prisma/prisma.service';


@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}
  

  async create(data: any): Promise<Products> {
    const created = await this.prisma.products.create({ data });
    return new Products(
      created.id,
      created.name,
      created.description,
      created.price,
      created.image_url,
      created.stock,
      created.created_at,
    );
  }

  async findAll(): Promise<Products[]> {
    const all = await this.prisma.products.findMany();
    return all.map(p => new Products(
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      p.stock,
      p.created_at,
    ));
  }

  async findById(id: number): Promise<Products | null> {
    const found = await this.prisma.products.findUnique({ where: { id } });
    return found
      ? new Products(
          found.id,
          found.name,
          found.description,
          found.price,
          found.image_url,
          found.stock,
          found.created_at,
        )
      : null;
  }

  async update(id: number, data: any): Promise<Products> {
    type Tipo = typeof updated;
    const updated = await this.prisma.products.update({ where: { id }, data });
    return new Products(
      updated.id,
      updated.name,
      updated.description,
      updated.price,
      updated.image_url,
      updated.stock,
      updated.created_at,
    );
  }

  async delete(id: number): Promise<void> {
    await this.prisma.products.delete({ where: { id } });
  }
}

