import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockRecord, StockSchema } from './schemas/stock.schema';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StockRecord.name, schema: StockSchema }])
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
