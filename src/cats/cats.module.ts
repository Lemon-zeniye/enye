import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';

@Module({
  imports: [],
  controllers: [CatsController],
  providers: [],
  exports: [],
})
export class CatsModule {}
