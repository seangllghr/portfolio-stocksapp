import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StockInterface } from '@portfolio-stocksapp/shared-data-model';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post()
  async create(@Body() inputStock: StockInterface) {
    const result = await this.stockService.create(inputStock);
    return result;
  }

  @Get(':symbol')
  async findBySymbol(@Param('symbol') symbol: string) {
    const result = await this.stockService.findBySymbol(symbol);
    return result;
  }

  @Patch()
  async update(@Body() stock: StockInterface) {
    const result = await this.stockService.update(stock.symbol, stock);
    return result;
  }

  @Delete(':symbol')
  async delete(@Param('symbol') symbol: string) {
    const result = await this.stockService.deleteStock(symbol);
    return result;
  }
}
