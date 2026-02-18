import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto
    })
    return product;
  }

  async findAll(paginationDto: PaginationDto) {

    const { page = 1, limit = 10 } = paginationDto;

    const totalPages = await this.prisma.product.count({
      where: {
        available: true
      }
    });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        totalPages,
        page,
        lastPage
      }
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        available: true
      }
    })

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: {
        id
      },
      data
    })

    return product;
  }

  async remove(id: number) {
    await this.findOne(id);

    // Hard delete - this actually deletes the record from the database
    // await this.prisma.product.delete({
    //   where: {
    //     id
    //   }
    // });

    // Soft delete - this just updates the available field to false
    await this.prisma.product.update({
      where: {
        id
      },
      data: {
        available: false
      }
    });

    return {
      message: `Product with id ${id} has been disabled`
    }
  }
}
