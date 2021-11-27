import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StockInterface } from '@portfolio-stocksapp/shared-data-model';
import { Document } from 'mongoose';
import { Interval } from './interval.schema';

@Schema()
export class Stock extends Document implements StockInterface {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  industry: string;

  @Prop()
  eps: number;

  @Prop()
  sharesOutstanding: number;

  @Prop()
  priceHistory: Interval[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);
