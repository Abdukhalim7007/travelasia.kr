import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardArticle, BoardArticleStatus } from '../../schemas/BoardArticle.model';
import { Comment, CommentStatus } from '../../schemas/Comment.model';

@Injectable()
export class CleanupJob {
  constructor(
    @InjectModel(BoardArticle.name) private readonly boardArticleModel: Model<BoardArticle>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  @Cron('0 3 * * *') // Every day at 03:00
  async cleanupDeletedArticles() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.boardArticleModel
      .deleteMany({
        status: BoardArticleStatus.DELETED,
        updatedAt: { $lt: thirtyDaysAgo },
      })
      .exec();

    console.log(`Cleanup job: Deleted ${result.deletedCount} old deleted board articles`);
  }

  @Cron('0 3 * * *') // Every day at 03:00
  async cleanupDeletedComments() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.commentModel
      .deleteMany({
        status: CommentStatus.DELETED,
        createdAt: { $lt: thirtyDaysAgo },
      })
      .exec();

    console.log(`Cleanup job: Deleted ${result.deletedCount} old deleted comments`);
  }
}

