import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stock/stock.controller';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [StockModule],
  controllers: [AppController, StockController],
  providers: [AppService],
})
export class AppModule {}
