import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { CreateCatDto } from 'src/dto/catsDto';

@Controller({ path: 'cats' })
export class CatsController {
  @Get()
  findAll(@Query('name') name: string) {
    return name;
  }
  // @Get()
  // findAll(): Observable<any[]> {
  //   return of(['1,2,3']);
  // }
  // @Post('create')
  // createACat(@Body() payload: CreateCatDto) {
  //   return `this is the dto ${payload}`;
  // }
  //   @Get()
  //   //   @Redirect('https://nestjs.com', 301)
  //   findAllCats(@Headers() haeader): string {
  //     return 'this is the req';
  //   }
  // @Get('breed')
  // findAllBreed(): string {
  //   return 'this is all the breed cats';
  // }
  // @Post()
  // createCat(@Req() request: Request) {
  //   console.log(request.body);
  // }
  // @Post('create')
  // create(@Body() payload) {
  //   return payload;
  // }
  // @Get('query')
  // getCatsByQuery(@Query() query: string) {
  //   return query;
  // }
  // @Get(':id')
  // getById(@Param() param: any) {
  //   return param.id;
  // }
}
