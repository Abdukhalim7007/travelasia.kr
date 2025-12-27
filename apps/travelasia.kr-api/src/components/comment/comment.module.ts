import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../../schemas/Comment.model';
import { Tour, TourSchema } from '../../schemas/Tour.model';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Tour.name, schema: TourSchema },
    ]),
    AuthModule,
  ],
  providers: [CommentService, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
