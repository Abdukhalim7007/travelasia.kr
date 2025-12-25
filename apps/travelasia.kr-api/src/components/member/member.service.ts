import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../schemas/Member.model';
import { MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
  ) {}

  async getMembers(): Promise<any[]> {
    return this.memberModel.find().lean().exec();
  }

  async getAgents(): Promise<any[]> {
    return this.memberModel.find({ memberType: MemberType.AGENT }).lean().exec();
  }
}

