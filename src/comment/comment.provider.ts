import { Provider } from '@nestjs/common';

import { Connection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.enum';
import { CommentEntity } from './entity/comment.entity';
import { CommentReplyEntity } from './entity/comment.reply.entity';

export const commentProviders: Provider[] = [
    {
        provide: RepositoryToken.CommentRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(CommentEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },

    {
        provide: RepositoryToken.CommentReplyRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(CommentReplyEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },
];
