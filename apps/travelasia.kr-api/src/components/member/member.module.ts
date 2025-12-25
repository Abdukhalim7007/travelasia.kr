import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { Member, MemberSchema } from '../../schemas/Member.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  providers: [MemberResolver, MemberService],
  exports: [MemberService],
})
export class MemberModule {}
