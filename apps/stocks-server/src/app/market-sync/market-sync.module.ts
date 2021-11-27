import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Stock, StockSchema } from '../stock/schemas/stock.schema';
import { MarketSyncService } from './market-sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    ScheduleModule.forRoot(),
    HttpModule
  ],
  providers: [MarketSyncService],
})
export class MarketSyncModule {}
