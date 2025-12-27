import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardArticle, BoardArticleStatus } from '../../schemas/BoardArticle.model';
import { CreateBoardArticleInput } from '../../libs/dto/board-article/board-article.input';
import { BoardArticlesInquiry } from '../../libs/dto/board-article/board-articles.inquiry';
import { BoardArticlesResponse } from '../../libs/dto/board-article/board-articles.response';

@Injectable()
export class BoardArticleService {
  constructor(
    @InjectModel(BoardArticle.name) private readonly boardArticleModel: Model<BoardArticle>,
  ) {}

  async createArticle(memberId: string, input: CreateBoardArticleInput): Promise<any> {
    const created = await this.boardArticleModel.create({
      ...input,
      authorId: memberId,
      status: BoardArticleStatus.ACTIVE,
    });
    return created.toObject ? created.toObject() : created;
  }

  async getArticles(input: BoardArticlesInquiry): Promise<BoardArticlesResponse> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      direction = -1,
      search,
    } = input;

    const filter: any = {
      status: { $ne: BoardArticleStatus.DELETED },
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.boardArticleModel.countDocuments(filter).exec();
    const list = await this.boardArticleModel
      .find(filter)
      .sort({ [sort]: direction as any })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return { list: list as any, total };
  }

  async getArticle(articleId: string): Promise<any> {
    const article = await this.boardArticleModel
      .findOneAndUpdate(
        { _id: articleId, status: BoardArticleStatus.ACTIVE },
        { $inc: { viewsCount: 1 } },
        { new: true, lean: true },
      )
      .exec();

    if (!article) throw new NotFoundException('Article not found');
    return article;
  }
}

