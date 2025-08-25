import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductAttributeDto } from './dto/product-attribute.dto';
import { ProductAttribute } from './entities/product-attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeValueDto } from './dto/attribute-value.dto';
import { AttributeValue } from './entities/attribute-value.entity';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,

    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
  ) {}

  // PRODUCT ATTRIBUTE ENDPOINTS

  async addProductAttribute(
    createProductAttributeDto: CreateProductAttributeDto,
  ) {
    const savedProductAttribute = await this.productAttributeRepository.save(
      createProductAttributeDto,
    );
    return savedProductAttribute;
  }

  async findAllProductAttributes() {
    const productAttributes = await this.productAttributeRepository
      .createQueryBuilder('productAttribute')
      .leftJoin('productAttribute.values', 'values')
      .loadRelationCountAndMap(
        'productAttribute.values_count',
        'productAttribute.values',
      )
      .getMany();

    return productAttributes;
  }

  async findProductAttributeById(id: number) {
    const productAttribute = await this.productAttributeRepository.findOne({
      where: { id },
      relations: ['values'],
    });

    if (!productAttribute) {
      throw new NotFoundException(`Product Attribute with id ${id} not Found!`);
    }

    return productAttribute;
  }

  async updateProductAttribute(
    id: number,
    updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    const productAttribute = await this.productAttributeRepository.findOneBy({
      id,
    });

    if (!productAttribute) {
      throw new NotFoundException(`Product Attribute with id ${id} not Found!`);
    }

    const updatedProductAttribute = await this.productAttributeRepository.merge(
      productAttribute,
      updateProductAttributeDto,
    );

    return this.productAttributeRepository.save(updatedProductAttribute);
  }

  async deleteProductAttribute(id: number) {
    const result = await this.productAttributeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product Attribute with id ${id} not Found!`);
    }

    return { message: `Product Attribute with id ${id} deleted successfully` };
  }

  // ATTRIBUTE VALUE ENDPOINTS

  async addAttributeValue(createAttributeValueDto: CreateAttributeValueDto) {
    const { attributeId, ...rest } = createAttributeValueDto;

    const attribute = await this.productAttributeRepository.findOneBy({
      id: attributeId,
    });

    if (!attribute) {
      throw new NotFoundException(
        `Product attribute with ID ${attributeId} not found`,
      );
    }

    const newAttributeValue = this.attributeValueRepository.create({
      ...rest,
      attribute,
    });

    return await this.attributeValueRepository.save(newAttributeValue);
  }

  async findAllAttributeValues() {
    return await this.attributeValueRepository.find({
      relations: ['attribute'],
    });
  }

  async findAttributeValueById(id: number) {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
      relations: ['attribute', 'variantAttributes'],
    });

    if (!attributeValue) {
      throw new NotFoundException(`Attribute value with id ${id} not found`);
    }

    return attributeValue;
  }

  async getAttributeValuesByProductAttribute(attributeId: number) {
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId },
      relations: ['values'],
    });

    if (!attribute) {
      throw new NotFoundException(
        `Product Attribute with id ${attributeId} not found`,
      );
    }

    return attribute.values;
  }

  async updateAttributeValue(
    id: number,
    updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    const attributeValue = await this.attributeValueRepository.findOneBy({
      id,
    });

    if (!attributeValue) {
      throw new NotFoundException(`Attribute value with id ${id} not found`);
    }

    const { attributeId, ...rest } = updateAttributeValueDto;

    const attribute = await this.productAttributeRepository.findOneBy({
      id: attributeId,
    });

    if (!attribute) {
      throw new NotFoundException(
        `Product Attribute with id ${attributeId} not found`,
      );
    }

    const updateAttributeValue = this.attributeValueRepository.merge(
      attributeValue,
      { ...rest, attribute },
    );

    return this.attributeValueRepository.save(updateAttributeValue);
  }

  async deleteAttributeValue(id: number) {
    const result = await this.attributeValueRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Attribute value with id ${id} not found`);
    }

    return { message: `Attribute value with id ${id} deleted successfully` };
  }
}
