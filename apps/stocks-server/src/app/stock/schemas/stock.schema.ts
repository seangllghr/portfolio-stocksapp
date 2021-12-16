import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StockData } from '@portfolio-stocksapp/shared-data-model';
import { Document } from 'mongoose';
import { Interval } from './interval.schema';

@Schema()
export class Stock extends Document implements StockData {
  @Prop({ required: true })
  Symbol: string;

  @Prop({ required: true })
  Name: string;

  @Prop()
  Industry: string;

  @Prop()
  EPS: number;

  @Prop()
  SharesOutstanding: number;

  @Prop()
  priceHistory: Interval[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);
