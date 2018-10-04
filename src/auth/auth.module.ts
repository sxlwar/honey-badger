import { Module, HttpModule } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { authProviders } from './auth.provider';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { AuthMessageService } from './service/auth.message.service';

@Module({
    imports: [DatabaseModule, HttpModule],
    providers: [...authProviders, AuthService, AuthMessageService],
    controllers: [AuthController],
})
export class AuthModule {}
