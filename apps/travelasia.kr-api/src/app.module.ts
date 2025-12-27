import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { ComponentsModule } from './components/components.module';
import { ScheduleModule } from '@nestjs/schedule';
import config, { validationSchema } from './libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ComponentsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        playground: configService.get<boolean>('graphql.playground'),
        introspection: configService.get<boolean>('graphql.introspection'),
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
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
