import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  nombreProd: string;

  @IsString()
  @MinLength(2)
  descripcion: string;

  @Matches(/^(?:\d+|\d*\.\d+)$/, { message: 'Ingresa un precio valido' })
  precio?: number;

  @IsString()
  @MinLength(2)
  @IsOptional()
  categoria?: string;

  @Matches(/^[1-9]\d*$/, { message: 'Ingresa un numero valido' })
  inStock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
