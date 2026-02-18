import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    @IsNumber({}, {message: 'The id must be a number'})
    @IsPositive({message: 'The id must be a positive number'})
    id: number;
}
