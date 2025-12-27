import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../../schemas/Member.model';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: configService.get<string>('jwt.accessExp') },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

