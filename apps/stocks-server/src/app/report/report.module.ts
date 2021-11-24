import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { StockModule } from '../stock/stock.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from '../stock/schemas/stock.schema';

@Module({
  imports: [
    StockModule,
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }])
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
