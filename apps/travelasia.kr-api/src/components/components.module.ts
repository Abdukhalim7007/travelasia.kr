import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { TourModule } from './tour/tour.module';
import { BookingModule } from './booking/booking.module';
import { FollowModule } from './follow/follow.module';
import { LikeModule } from './like/like.module';
import { FavoriteModule } from './favorite/favorite.module';
import { VisitedModule } from './visited/visited.module';
import { CommentModule } from './comment/comment.module';
import { BoardArticleModule } from './board-article/board-article.module';

// Feature modules (Auth/Member/Tour/Booking/Follow/Payment) will be added incrementally
// Only import/export modules when their *.module.ts files exist

@Module({
  imports: [
    AuthModule,
    MemberModule,
    TourModule,
    BookingModule,
    FollowModule,
    LikeModule,
    FavoriteModule,
    VisitedModule,
    CommentModule,
    BoardArticleModule,
  ],
  exports: [
    AuthModule,
    MemberModule,
    TourModule,
    BookingModule,
    FollowModule,
    LikeModule,
    FavoriteModule,
    VisitedModule,
    CommentModule,
    BoardArticleModule,
  ],
})
export class ComponentsModule {}
