import { Module } from '@nestjs/common';

import { commentProviders } from './comment.provider';
import { CommentController } from './controller/comment.controller';
import { CommentMessageService } from './service/comment.message.service';
import { CommentService } from './service/comment.service';
import { DatabaseModule } from 'database/database.module';
import { SharedModule } from 'shared/shared.module';

@Module({
    controllers: [CommentController],
    imports: [DatabaseModule, SharedModule],
    providers: [CommentService, CommentMessageService, ...commentProviders],
})
export class CommentModule {}
