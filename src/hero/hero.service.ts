import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Repository } from 'typeorm';
import { Hero } from './entities/hero.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageSection } from './entities/ImageSection.entity';
import { CreateImageSectionDto } from './dto/create-image-section.dto';
import { UpdateImageSectionDto } from './dto/update-image-section.dto';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
    @InjectRepository(ImageSection)
    private readonly imageSectionRepository: Repository<ImageSection>,
  ) {}

  async create(createHeroDto: CreateHeroDto) {
    const hero = await this.heroRepository.create(createHeroDto);
    return await this.heroRepository.save(hero);
  }
  async findAll() {
    return await this.heroRepository.find();
  }

  async findOne(id: number) {
    return await this.heroRepository.findOne({ where: { id } });
  }

  async update(id: number, updateHeroDto: UpdateHeroDto) {
    const hero = await this.heroRepository.findOne({ where: { id } });

    if (!hero) {
      throw new NotFoundException(`Element with id ${id} not found!`);
    }

    const updatedHero = await this.heroRepository.merge(hero, updateHeroDto);

    return await this.heroRepository.save(updatedHero);
  }

  async remove(id: number) {
    const hero = await this.heroRepository.findOne({ where: { id } });
    return await this.heroRepository.remove(hero);
  }

  async findActiveHero() {
    return await this.heroRepository.findOne({
      where: { isActive: true },
    });
  }

  ///image seaction

  async findAllImageSection() {
    return await this.imageSectionRepository.find();
  }

  async createImageSection(createImageSectionDto: CreateImageSectionDto) {
    const section = this.imageSectionRepository.create(createImageSectionDto);
    return await this.imageSectionRepository.save(section);
  }

  async findOneImageSection(id: number) {
    const section = await this.imageSectionRepository.findOne({
      where: { id },
    });
    if (!section) {
      throw new NotFoundException('Image section not found');
    }
    return section;
  }

  async updateImageSection(
    id: number,
    updateImageSectionDto: UpdateImageSectionDto,
  ) {
    const section = await this.findOneImageSection(id);
    Object.assign(section, updateImageSectionDto);
    return await this.imageSectionRepository.save(section);
  }

  async removeImageSection(id: number) {
    const section = await this.findOneImageSection(id);
    await this.imageSectionRepository.remove(section);
  }

  async findActiveImageSections() {
    return await this.imageSectionRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }
}
