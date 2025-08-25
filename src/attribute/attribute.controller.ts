import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateProductAttributeDto } from './dto/product-attribute.dto';
import { CreateAttributeValueDto } from './dto/attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  // PRODUCT ATTRIBUTE ROUTES
  @Post('product-attributes')
  createProductAttribute(
    @Body() createProductAttributeDto: CreateProductAttributeDto,
  ) {
    return this.attributeService.addProductAttribute(createProductAttributeDto);
  }

  @Get('product-attributes')
  findAllProductAttributes() {
    return this.attributeService.findAllProductAttributes();
  }

  @Get('product-attributes/:id')
  findProductAttributeById(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.findProductAttributeById(id);
  }

  @Put('product-attributes/:id')
  updateProductAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    return this.attributeService.updateProductAttribute(
      id,
      updateProductAttributeDto,
    );
  }

  @Delete('product-attributes/:id')
  deleteProductAttribute(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.deleteProductAttribute(id);
  }

  // ATTRIBUTE VALUE ROUTES
  @Post('values')
  createAttributeValue(
    @Body() createAttributeValueDto: CreateAttributeValueDto,
  ) {
    return this.attributeService.addAttributeValue(createAttributeValueDto);
  }

  @Get('values')
  findAllAttributeValues() {
    return this.attributeService.findAllAttributeValues();
  }

  @Get('values/:id')
  findAttributeValueById(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.findAttributeValueById(id);
  }

  @Get('product-attributes/:attributeId/values')
  getAttributeValuesByProductAttribute(
    @Param('attributeId', ParseIntPipe) attributeId: number,
  ) {
    return this.attributeService.getAttributeValuesByProductAttribute(
      attributeId,
    );
  }

  @Put('values/:id')
  updateAttributeValue(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttributeValueDto: UpdateAttributeValueDto,
  ) {
    return this.attributeService.updateAttributeValue(
      id,
      updateAttributeValueDto,
    );
  }

  @Delete('values/:id')
  deleteAttributeValue(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.deleteAttributeValue(id);
  }
}
