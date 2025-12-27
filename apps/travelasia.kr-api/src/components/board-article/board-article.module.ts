import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardArticleResolver } from './board-article.resolver';
import { BoardArticleService } from './board-article.service';
import { BoardArticle, BoardArticleSchema } from '../../schemas/BoardArticle.model';
import { AuthModule } from '../auth/auth.module';
import { CleanupJob } from '../../libs/scheduler/cleanup.job';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BoardArticle.name, schema: BoardArticleSchema }]),
    AuthModule,
  ],
  providers: [BoardArticleResolver, BoardArticleService, CleanupJob],
  exports: [BoardArticleService],
})
export class BoardArticleModule {}

