import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { StockInterface } from "@portfolio-stocksapp/data"
import { Interval } from "./interval.schema";

export type StockDocument = StockInterface & mongoose.Document;

@Schema()
export class Stock implements StockInterface {
  @Prop()
  symbol: string;

  @Prop()
  name: string;

  @Prop()
  sharesOutstanding: number;

  @Prop()
  priceHistory: Interval[]
}

export const StockSchema = SchemaFactory.createForClass(Stock);
