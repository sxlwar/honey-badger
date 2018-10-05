import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { SharedModule } from '../shared/shared.module';
import { commentProviders } from './comment.provider';
import { CommentController } from './controller/comment.controller';
import { CommentMessageService } from './service/comment.message.service';
import { CommentService } from './service/comment.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [CommentController],
    imports: [DatabaseModule, SharedModule, AuthModule],
    providers: [CommentService, CommentMessageService, ...commentProviders],
})
export class CommentModule {}
