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
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, name, password, direccion, telefono, roles } = createUserDto;
    try {
      const user = this.userRepository.create({
        email: email,
        password: bcrypt.hashSync(password, 10),
        name: name,
        direccion: direccion,
        telefono: telefono,
        roles: roles,
      });
      await this.userRepository.save(user);
      delete user.password;

      return { ...user, token: this.getJwtToken({ id: user.id }) };
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

    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async GetUsers(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const users = await this.userRepository.find({
        take: limit,
        skip: offset,
      });
      if (!users || users.length === 0) {
        throw new BadRequestException('No se encontraron usuarios');
      }

      return users;
    } catch (error) {
      console.log(error);
      this.captureError(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  private captureError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException(
      'Hubo un error interno en el servidor',
    );
  }
}
