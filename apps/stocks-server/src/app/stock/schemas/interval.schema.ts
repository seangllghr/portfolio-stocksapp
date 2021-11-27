import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IntervalInterface } from '@portfolio-stocksapp/shared-data-model';
import { Document } from 'mongoose';

@Schema()
export class Interval extends Document implements IntervalInterface {
  @Prop({ required: true })
  interval: Date;

  @Prop({ required: true })
  open: number;

  @Prop({ required: true })
  high: number;

  @Prop({ required: true })
  low: number;

  @Prop({ required: true })
  close: number;

  @Prop({ required: true })
  volume: number;
}

export const IntervalSchema = SchemaFactory.createForClass(Interval);
