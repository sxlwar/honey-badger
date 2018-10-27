import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config/config.service';

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(`config/${process.env.NODE_ENV}.env`),
        },
    ],
    exports: [ConfigService],
})
export class SharedModule {}
