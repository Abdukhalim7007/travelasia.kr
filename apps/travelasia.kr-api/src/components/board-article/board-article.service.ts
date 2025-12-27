import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardArticle, BoardArticleStatus } from '../../schemas/BoardArticle.model';
import { CreateBoardArticleInput, UpdateBoardArticleInput } from '../../libs/dto/board-article/board-article.input';
import { BoardArticlesInquiry } from '../../libs/dto/board-article/board-articles.inquiry';
import { BoardArticlesResponse } from '../../libs/dto/board-article/board-articles.response';
import { MemberType } from '../../libs/enums/member.enum';

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
      status: BoardArticleStatus.ACTIVE,
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

  async updateArticle(
    articleId: string,
    memberId: string,
    memberType: MemberType,
    input: UpdateBoardArticleInput,
  ): Promise<any> {
    const article = await this.boardArticleModel
      .findOne({ _id: articleId, status: { $ne: BoardArticleStatus.DELETED } })
      .lean()
      .exec();

    if (!article) throw new NotFoundException('Article not found');

    // Permission check: ADMIN can update any, AGENT can only update their own
    if (memberType !== MemberType.ADMIN && String(article.authorId) !== memberId) {
      throw new ForbiddenException('You do not have permission to update this article');
    }

    const updated = await this.boardArticleModel
      .findByIdAndUpdate(
        articleId,
        { $set: { title: input.title, content: input.content } },
        { new: true, lean: true },
      )
      .exec();

    return updated;
  }

  async removeArticle(articleId: string, memberId: string, memberType: MemberType): Promise<boolean> {
    const article = await this.boardArticleModel
      .findOne({ _id: articleId, status: { $ne: BoardArticleStatus.DELETED } })
      .lean()
      .exec();

    if (!article) throw new NotFoundException('Article not found');

    // Permission check: ADMIN can remove any, AGENT can only remove their own
    if (memberType !== MemberType.ADMIN && String(article.authorId) !== memberId) {
      throw new ForbiddenException('You do not have permission to remove this article');
    }

    await this.boardArticleModel
      .findByIdAndUpdate(articleId, { $set: { status: BoardArticleStatus.DELETED } })
      .exec();

    return true;
  }

  async getArticlesByAdmin(input?: BoardArticlesInquiry): Promise<BoardArticlesResponse> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      direction = -1,
      search,
      status,
    } = input || {};

    const filter: any = {
      status: { $ne: BoardArticleStatus.DELETED },
    };

    if (status) {
      filter.status = status;
    }

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

  async blockArticleByAdmin(articleId: string): Promise<any> {
    const article = await this.boardArticleModel
      .findOneAndUpdate(
        { _id: articleId, status: { $ne: BoardArticleStatus.DELETED } },
        { $set: { status: BoardArticleStatus.BLOCKED } },
        { new: true, lean: true },
      )
      .exec();

    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async unblockArticleByAdmin(articleId: string): Promise<any> {
    const article = await this.boardArticleModel
      .findOneAndUpdate(
        { _id: articleId, status: { $ne: BoardArticleStatus.DELETED } },
        { $set: { status: BoardArticleStatus.ACTIVE } },
        { new: true, lean: true },
      )
      .exec();

    if (!article) throw new NotFoundException('Article not found');
    return article;
  }
}

