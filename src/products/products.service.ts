import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { User } from 'src/auth/entities/auth.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly configService: ConfigService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    user: User,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('No se proporcionaron imágenes');

    try {
      const productImages = [];
      for (const file of files) {
        const secureUrl = `${this.configService.get(
          'HOST_API',
        )}/files/product/${file.filename}`;
        const productImage = this.productImageRepository.create({
          url: secureUrl,
        });
        const savedImage = await this.productImageRepository.save(productImage);
        productImages.push(savedImage);
      }

      const { images = [], ...detailsProducts } = createProductDto;

      const product = this.productRepository.create({
        ...detailsProducts,
        images: productImages,
        user,
      });

      const savedProduct = await this.productRepository.save(product);

      return { ...savedProduct, images: images };
    } catch (error) {
      console.log(error);
      this.captureError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 9, offset = 0, categoria } = paginationDto;

    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .take(limit)
      .skip(offset);

    if (categoria) {
      queryBuilder = queryBuilder.where('product.categoria = :categoria', {
        categoria,
      });
    }

    const products = await queryBuilder.getMany();

    if (!products || products.length === 0) {
      throw new BadRequestException('No se encontraron productos');
    }

    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    delete product.user.password;
    if (!product)
      throw new BadRequestException(
        `No se encontro el producto con el id:${id}`,
      );
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    if (!id) throw new NotFoundException(`id:${id} invalido`);
    const deleteProduct = await this.productRepository.delete({ id });

    if (deleteProduct.affected === 0)
      throw new BadRequestException(`No se encontro el producto con id:${id}`);

    return deleteProduct.affected === 1
      ? 'Producto Eliminado Exitosamente'
      : '';
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
