import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FilesService } from 'src/files/files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, FilesService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    AuthModule,
    ConfigModule,
  ],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
