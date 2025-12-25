import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../schemas/Member.model';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from '../../libs/dto/auth/auth.input';
import { AuthPayload } from '../../libs/dto/auth/auth';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Member.name) private memberModel: Model<Member>,
  ) {}

  @Mutation(() => AuthPayload)
  async signup(@Args('input') input: SignupInput): Promise<AuthPayload> {
    const existingMember = await this.memberModel.findOne({ email: input.email });
    if (existingMember) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.authService.hashPassword(input.password);
    const newMember = await this.memberModel.create({
      email: input.email,
      password: hashedPassword,
      fullName: input.fullName || input.email.split('@')[0],
      memberType: MemberType.USER,
    });

    const payload = {
      _id: newMember._id,
      email: newMember.email,
      memberType: newMember.memberType,
    };

    const accessToken = await this.authService.createToken(payload);

    return { accessToken };
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    const member = await this.memberModel.findOne({ email: input.email });
    if (!member) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.authService.comparePasswords(
      input.password,
      member.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      _id: member._id,
      email: member.email,
      memberType: member.memberType,
    };

    const accessToken = await this.authService.createToken(payload);

    return { accessToken };
  }
}
