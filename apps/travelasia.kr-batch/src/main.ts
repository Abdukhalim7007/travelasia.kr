import { NestFactory } from '@nestjs/core';
import { TravelasiaKrBatchModule } from './travelasia.kr-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(TravelasiaKrBatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
