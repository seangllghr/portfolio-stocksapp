import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Stock } from '@portfolio-stocksapp/shared-data-model';
import { Document } from 'mongoose';
import { Interval } from './interval.schema';

export type StockDocument = Stock & Document;

@Schema()
export class StockRecord implements Stock {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  sharesOutstanding: number;

  @Prop()
  priceHistory: Interval[];
}

export const StockSchema = SchemaFactory.createForClass(StockRecord);
