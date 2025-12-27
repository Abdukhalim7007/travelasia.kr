import * as Joi from 'joi';

export interface AppConfig {
  port: number;
  env: string;
  apiPrefix?: string;
  corsOrigins: string[];
}

export interface DatabaseConfig {
  uri: string;
}

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExp: string;
  refreshExp: string;
}

export interface UploadConfig {
  maxFileSize: number;
  maxFiles: number;
}

export interface GraphQLConfig {
  playground: boolean;
  introspection: boolean;
}

export interface Config {
  app: AppConfig;
  db: DatabaseConfig;
  jwt: JwtConfig;
  upload: UploadConfig;
  graphql: GraphQLConfig;
}

export default (): Config => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';

  return {
    app: {
      port: parseInt(process.env.PORT || '3000', 10),
      env: nodeEnv,
      corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
    },
    db: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/travelasia',
    },
    jwt: {
      accessSecret:
        process.env.JWT_SECRET ||
        (isProduction ? '' : 'your-secret-key-change-in-production'),
      refreshSecret:
        process.env.JWT_REFRESH_SECRET ||
        (isProduction ? '' : 'your-refresh-secret-key-change-in-production'),
      accessExp: process.env.JWT_EXPIRES_IN || '7d',
      refreshExp: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10000000', 10),
      maxFiles: parseInt(process.env.MAX_FILES || '10', 10),
    },
    graphql: {
      playground: nodeEnv !== 'production',
      introspection: nodeEnv !== 'production',
    },
  };
};

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JWT_REFRESH_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  MAX_FILE_SIZE: Joi.number().default(10000000),
  MAX_FILES: Joi.number().default(10),
  CORS_ORIGINS: Joi.string().optional(),
});
