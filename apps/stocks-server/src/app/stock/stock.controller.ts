import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';

@Controller('stock')
export class StockController {
  @Post()
  create(): string {
    return 'This action adds a new stock';
  }

  @Get(':symbol')
  findBySymbol(@Param('symbol') symbol: string): string {
    return `This route will return data about ${symbol}`;
  }

  @Put()
  update(): string {
    return 'This route will update a stock';
  }

  @Delete()
  delete(): string {
    return 'This route will delete a stock';
  }
}
