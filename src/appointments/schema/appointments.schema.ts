import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Appointments {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  doctor: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  patient: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'TimeSlot', required: true })
  slot: Types.ObjectId;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const AppointmentsSchema = SchemaFactory.createForClass(Appointments);
