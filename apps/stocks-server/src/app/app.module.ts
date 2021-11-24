import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from '../assets/config.json';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Stock, StockSchema } from './stock/schemas/stock.schema';
import { StockController } from './stock/stock.controller';
import { StockModule } from './stock/stock.module';
import { StockService } from './stock/stock.service';
import { ReportModule } from './report/report.module';

const connectString = 'mongodb+srv://'
  + `${config.connectString.user}:${config.connectString.pass}`
  + `@${config.connectString.host}/${config.connectString.db}`
  + `?${config.connectString.opts.join('&')}`

@Module({
  imports: [
    StockModule,
    MongooseModule.forRoot(connectString),
    MongooseModule.forFeature([{ name: Stock.name, schema: StockSchema }]),
    ReportModule,
  ],
  controllers: [AppController, StockController],
  providers: [AppService, StockService],
})
export class AppModule {}
