import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { Follow, FollowSchema } from '../../schemas/Follow.model';
import { Member, MemberSchema } from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
    AuthModule,
  ],
  providers: [FollowResolver, FollowService],
  exports: [FollowService],
})
export class FollowModule {}
