import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stock/stock.controller';
import { StockModule } from './stock/stock.module';
import { StockService } from './stock/stock.service';
import * as config from '../assets/config.json'

const connectString = 'mongodb+srv://'
  + `${config.connectString.user}:${config.connectString.pass}`
  + `@${config.connectString.host}/${config.connectString.db}`
  + `?${config.connectString.opts.join('&')}`

@Module({
  imports: [StockModule, MongooseModule.forRoot(connectString)],
  controllers: [AppController, StockController],
  providers: [AppService, StockService],
})
export class AppModule {}
