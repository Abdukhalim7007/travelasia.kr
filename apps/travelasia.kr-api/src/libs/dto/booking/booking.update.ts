import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { BookingStatus } from '../../enums/booking.enum';

@InputType()
export class BookingUpdate {
  @IsOptional()
  @Field(() => String, { nullable: true })
  status?: BookingStatus;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  totalPrice?: number;
}

