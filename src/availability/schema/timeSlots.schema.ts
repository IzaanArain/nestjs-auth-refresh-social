import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TimeSlot {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Availability', required: true })
  availability: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  doctor: Types.ObjectId;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);
