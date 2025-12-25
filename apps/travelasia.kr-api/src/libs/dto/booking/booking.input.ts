import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class BookingInput {
  @IsNotEmpty()
  @Field(() => String)
  tourId: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  numberOfGuests?: number;
}

