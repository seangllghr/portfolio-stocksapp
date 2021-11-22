import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { StockInterface } from '@portfolio-stocksapp/data';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post()
  async create(@Body() inputStock: StockInterface) {
    const result = await this.stockService.create(inputStock);
    return JSON.stringify(result);
  }

  @Get(':symbol')
  async findBySymbol(@Param('symbol') symbol: string) {
    let result = await this.stockService.findBySymbol(symbol)
    return JSON.stringify(result);
  }

  @Put(':symbol')
  update(
    @Param('symbol') symbol: string,
    @Body() stock: StockInterface
  ): string {
    return JSON.stringify(this.stockService.update(symbol, stock))
  }

  @Delete(':symbol')
  async delete(@Param('symbol') symbol: string) {
    let result = await this.stockService.deleteStock(symbol)
    return JSON.stringify(result)
  }
}
