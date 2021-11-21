import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { Stock } from '@portfolio-stocksapp/data';

@Controller('stock')
export class StockController {
  @Post()
  async create(@Body() stock: Stock) {
    return `This action adds a new stock record for ${stock.symbol}\n`
      + `Company Name: ${stock.name}\n`
      + `Shares Outstanding: ${stock.sharesOutstanding}`;
  }

  @Get(':symbol')
  findBySymbol(@Param('symbol') symbol: string): string {
    return `This route will return data about ${symbol}`;
  }

  @Put(':symbol')
  update(
    @Param('symbol') symbol: string,
    @Body() stock: Stock
  ): string {
    return `This route will update ${symbol}\n`
      + `New stock data: ${JSON.stringify(stock)}`;
  }

  @Delete(':symbol')
  delete(@Param('symbol') symbol: string): string {
    return `This route will delete ${symbol} from the database`;
  }
}
