import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Stock } from '@portfolio-stocksapp/data';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post()
  async create(@Body() inputStock: Stock) {
    this.stockService.create(inputStock);
  }

  @Get(':symbol')
  findBySymbol(@Param('symbol') symbol: string): string {
    return JSON.stringify(this.stockService.findBySymbol(symbol));
  }

  @Put(':symbol')
  update(
    @Param('symbol') symbol: string,
    @Body() stock: Stock
  ): string {
    return JSON.stringify(this.stockService.update(symbol, stock))
  }

  @Delete(':symbol')
  delete(@Param('symbol') symbol: string) {
    this.stockService.deleteStock(symbol)
  }
}
