import * as dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Habilitar CORS solo para el frontend
  app.enableCors({
    origin: 'http://localhost:3000',
  })

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 Backend corriendo en http://localhost:${port}`)
}

bootstrap()
