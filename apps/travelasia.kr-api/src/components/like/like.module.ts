import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Like, LikeSchema } from '../../schemas/Like.model';
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]), AuthModule],
  providers: [LikeResolver, LikeService],
  exports: [LikeService],
})
export class LikeModule {}

