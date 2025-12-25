import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class BookingInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  tourId: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  numberOfGuests: number;
}

