import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LikeTargetType } from '../../enums/like.enum';

@InputType()
export class LikeInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  targetId: string;

  @IsNotEmpty()
  @IsEnum(LikeTargetType)
  @Field(() => String)
  targetType: LikeTargetType;
}

