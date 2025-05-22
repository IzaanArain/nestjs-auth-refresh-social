import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { UserRole } from '../enum/user-role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({required: true,})
  name: string;

  @Prop({required: true})
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    // required: true,
    default: UserRole.Patient
  })
  role: UserRole;

  @Prop({ default: null })
  specialization: String;
}

export const UserSchema = SchemaFactory.createForClass(User);
