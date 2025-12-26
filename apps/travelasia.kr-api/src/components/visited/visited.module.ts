import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Visited, VisitedSchema } from '../../schemas/Visited.model';
import { VisitedResolver } from './visited.resolver';
import { VisitedService } from './visited.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visited.name, schema: VisitedSchema }]),
    AuthModule,
  ],
  providers: [VisitedResolver, VisitedService],
  exports: [VisitedService],
})
export class VisitedModule {}

