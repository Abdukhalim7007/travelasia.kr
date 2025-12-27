import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { ComponentsModule } from './components/components.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ComponentsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      formatError: (error: any) => {
        const graphQLFormattedError = {
          code: error?.extensions?.code,
          message:
            error?.extensions?.exception?.response?.message ||
            error?.extensions?.response?.message ||
            error?.message,
        };
        console.log('GRAPHQL ERROR:', graphQLFormattedError);
        return graphQLFormattedError;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}

