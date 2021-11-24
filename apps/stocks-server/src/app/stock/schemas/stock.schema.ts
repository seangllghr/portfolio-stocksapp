import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StockInterface } from '@portfolio-stocksapp/shared-data-model';
import { Document } from 'mongoose';
import { Interval } from './interval.schema';

export type StockDocument = StockInterface & Document;

@Schema()
export class Stock implements StockInterface {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  sharesOutstanding: number;

  @Prop()
  priceHistory: Interval[];
}

export const StockSchema = SchemaFactory.createForClass(Stock);
