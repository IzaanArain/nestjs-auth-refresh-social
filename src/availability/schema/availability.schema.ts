import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Availability {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  doctor: Types.ObjectId;

  @Prop({ required: true })
  day: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'TimeSlot', required: true })
  slots: Types.ObjectId[];
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
