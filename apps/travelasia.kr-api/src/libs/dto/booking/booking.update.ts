import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { BookingStatus } from '../../enums/booking.enum';

@InputType()
export class BookingUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @IsNotEmpty()
  @IsEnum(BookingStatus)
  @Field(() => String)
  status: BookingStatus;
}

