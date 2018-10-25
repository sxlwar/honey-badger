import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config/config.service';

const ENV_PATH = process.cwd() + '/config/' + process.env.NODE_ENV + '.env';

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(ENV_PATH),
        },
    ],
    exports: [ConfigService],
})
export class SharedModule {}
