import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Stock, StockSchema } from '../stock/schemas/stock.schema';
import { MarketSyncService } from './market-sync.service';
import { MarketSyncController } from './market-sync.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  providers: [MarketSyncService],
  controllers: [MarketSyncController],
})
export class MarketSyncModule {}
