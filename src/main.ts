import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as helmet from 'helmet';

import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: { origin: ['http://localhost:4200', 'http://localhost:3000'] },
    });
    // const app = await NestFactory.create(AppModule, { cors: true });

    const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port.toString()}` : AppModule.host;

    // Help secure app by setting various HTTP headers;
    app.use(helmet());

    const options = new DocumentBuilder()
        .setTitle('Ratel')
        .setDescription('API Documentation from Ratel')
        .setVersion('1.0.0')
        .setHost(hostDomain.split('//')[1])
        .setSchemes(AppModule.isDev ? 'http' : 'https')
        .addTag('Article', 'Article related api')
        .build();

    const documentation = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/swagger', app, documentation);

    await app.listen(AppModule.port);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
