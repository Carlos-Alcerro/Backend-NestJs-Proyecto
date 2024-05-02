import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  nombreProd: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  descripcion: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  categoria: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  inStock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
