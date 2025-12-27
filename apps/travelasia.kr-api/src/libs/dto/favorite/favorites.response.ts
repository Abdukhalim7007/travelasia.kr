import { Field, ObjectType } from '@nestjs/graphql';
import { FavoriteDTO } from './favorite';

@ObjectType()
export class FavoritesResponse {
  @Field(() => [FavoriteDTO])
  list: FavoriteDTO[];

  @Field(() => Number)
  total: number;
}

