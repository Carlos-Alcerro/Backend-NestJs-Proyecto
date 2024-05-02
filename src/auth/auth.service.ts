import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    try {
      const user = this.userRepository.create({
        email: email,
        password: bcrypt.hashSync(password, 10),
        name: name,
      });
      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      console.log(error);
      this.captureError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new UnauthorizedException('Credenciales incorrectas (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas (contrasena)');

    delete user.password;

    return { user };
  }

  private captureError(error: any) {
    if (error.code === '23505') throw new NotFoundException(error.detail);
    throw new InternalServerErrorException(
      'Hubo un error interno en el servidor',
    );
  }
}
