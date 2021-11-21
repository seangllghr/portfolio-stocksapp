import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stock/stock.controller';
import { StockModule } from './stock/stock.module';
import { StockService } from './stock/stock.service';

@Module({
  imports: [StockModule],
  controllers: [AppController, StockController],
  providers: [AppService, StockService],
})
export class AppModule {}
