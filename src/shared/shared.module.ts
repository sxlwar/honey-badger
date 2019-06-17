import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config/config.service';
import { EmailPipe } from './pipes/shared.pipe';

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(`config/${process.env.NODE_ENV}.env`),
        },
        EmailPipe,
    ],
    exports: [ConfigService],
})
export class SharedModule {}
