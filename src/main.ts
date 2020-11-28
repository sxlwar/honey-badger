import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { Env } from './shared/constant/constant';

declare const module: any;

async function bootstrap() {
    const isDev = process.env.NODE_ENV === Env.development;
    const app = await NestFactory.create(AppModule, { cors: isDev || ['chtoma.com'] });
    const hostDomain = AppModule.notProd ? `${AppModule.host}:${AppModule.port.toString()}` : AppModule.host;

    // Help secure app by setting various HTTP headers;
    app.use(helmet());

    const options = new DocumentBuilder()
        .setTitle('Ratel')
        .setDescription('API Documentation from Ratel')
        .setVersion('1.0.0')
        .setHost(hostDomain.split('//')[1])
        .setSchemes('http')
        .addTag('Article', 'Article related api')
        .build();

    const documentation = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('/swagger', app, documentation);

    await app.listen(AppModule.port);

    if (module.hot && AppModule.notProd) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
