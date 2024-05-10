import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @Matches(
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    { message: 'El correo electronico no tiene formato adecuado' },
  )
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/, {
    message:
      'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.',
  })
  password: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @MinLength(8)
  @MaxLength(8)
  telefono?: number;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsOptional()
  direccion?: string;
}
