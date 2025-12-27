import { registerEnumType } from '@nestjs/graphql';

export enum LikeTargetType {
  TOUR = 'TOUR',
}

registerEnumType(LikeTargetType, {
  name: 'LikeTargetType',
});
