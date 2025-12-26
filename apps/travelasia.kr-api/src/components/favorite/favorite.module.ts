import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Favorite, FavoriteSchema } from '../../schemas/Favorite.model';
import { Tour, TourSchema } from '../../schemas/Tour.model';
import { FavoriteResolver } from './favorite.resolver';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
      { name: Tour.name, schema: TourSchema },
    ]),
    AuthModule,
  ],
  providers: [FavoriteResolver, FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}

