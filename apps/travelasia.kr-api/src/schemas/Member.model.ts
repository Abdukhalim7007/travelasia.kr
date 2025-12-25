import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MemberType, MemberStatus } from '../libs/enums/member.enum';

@Schema({ timestamps: true })
export class Member extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: String, enum: MemberType, default: MemberType.USER })
  memberType: MemberType;

  @Prop({ type: String, enum: MemberStatus, default: MemberStatus.ACTIVE })
  status: MemberStatus;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);




