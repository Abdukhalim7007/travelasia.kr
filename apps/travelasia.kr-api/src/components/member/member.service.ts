import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../schemas/Member.model';
import { MemberType } from '../../libs/enums/member.enum';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { MembersInquiry } from '../../libs/dto/member/members.inquiry';
import { MembersResponse } from '../../libs/dto/member/members.response';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
  ) {}

  async getMembers(input: MembersInquiry): Promise<MembersResponse> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      direction = -1,
      search,
    } = input;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await this.memberModel.countDocuments(filter).exec();
    const list = await this.memberModel
      .find(filter)
      .sort({ [sort]: direction as any })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return { list: list as any, total };
  }

  async getMembersLegacy(): Promise<any[]> {
    return this.memberModel.find().lean().exec();
  }

  async getAgents(): Promise<any[]> {
    return this.memberModel.find({ memberType: MemberType.AGENT }).lean().exec();
  }

  async updateMemberAvatar(memberId: string, file: any): Promise<any> {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${memberId}_${Date.now()}_${filename}`;
    const uploadDir = join(process.cwd(), 'public/uploads/avatars');

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, uniqueFilename);
    const savedPath = `/uploads/avatars/${uniqueFilename}`;

    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', async () => {
          const updated = await this.memberModel
            .findByIdAndUpdate(memberId, { avatar: savedPath }, { new: true })
            .lean()
            .exec();
          resolve(updated);
        })
        .on('error', (err) => reject(err));
    });
  }

  async getAllMembersByAdmin(): Promise<any[]> {
    return this.memberModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async updateMemberByAdmin(memberId: string, input: any): Promise<any> {
    const updated = await this.memberModel
      .findByIdAndUpdate(memberId, input, { new: true })
      .lean()
      .exec();
    if (!updated) throw new NotFoundException('Member not found');
    return updated;
  }
}

