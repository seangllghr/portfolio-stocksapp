import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Stock } from "@portfolio-stocksapp/data"

export type StockDocument = Stock & Document;

@Schema()
export class StockClass implements Stock {
  @Prop()
  symbol: string;

  @Prop()
  name: string;

  @Prop()
  sharesOutstanding: number;
}

export const StockSchema = SchemaFactory.createForClass(StockClass);
