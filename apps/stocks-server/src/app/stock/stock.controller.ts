import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StockData } from '@portfolio-stocksapp/shared-data-model';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post()
  async create(@Body() inputStock: StockData) {
    const result = await this.stockService.create(inputStock);
    return result;
  }

  @Get()
  async getAll() {
    const result = await this.stockService.findAll();
    return result;
  }

  @Get(':symbol')
  async findBySymbol(@Param('symbol') symbol: string) {
    const result = await this.stockService.findBySymbol(symbol);
    return result;
  }

  @Patch()
  async update(@Body() stock: StockData) {
    const result = await this.stockService.update(stock.Symbol, stock);
    return result;
  }

  @Delete(':symbol')
  async delete(@Param('symbol') symbol: string) {
    const result = await this.stockService.deleteStock(symbol);
    return result;
  }
}
