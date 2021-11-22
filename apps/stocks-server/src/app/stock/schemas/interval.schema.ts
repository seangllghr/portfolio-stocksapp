import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { IntervalInterface } from "@portfolio-stocksapp/data"

export type StockDocument = Interval & Document;

@Schema()
export class Interval implements IntervalInterface {
  @Prop()
  interval: Date;

  @Prop()
  open: number;

  @Prop()
  high: number;

  @Prop()
  low: number;

  @Prop()
  close: number;

  @Prop()
  volume: number;
}

export const IntervalSchema = SchemaFactory.createForClass(Interval);
