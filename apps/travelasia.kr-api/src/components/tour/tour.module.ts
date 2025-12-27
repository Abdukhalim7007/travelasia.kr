import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourResolver } from './tour.resolver';
import { TourService } from './tour.service';
import { Tour, TourSchema } from '../../schemas/Tour.model';
import { AuthModule } from '../auth/auth.module';
import { LikeModule } from '../like/like.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { VisitedModule } from '../visited/visited.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    AuthModule,
    LikeModule,
    FavoriteModule,
    VisitedModule,
    CommentModule,
  ],
  providers: [TourResolver, TourService],
  exports: [TourService],
})
export class TourModule {}
