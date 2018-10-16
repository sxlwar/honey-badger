import { Provider } from '@nestjs/common';

import { Connection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.enum';
import { UserEntity } from './entity/auth.entity';
import { ArticleEntity } from '../article/entity/article.entity';

export const authProviders: Provider[] = [
    {
        provide: RepositoryToken.AuthRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(UserEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },
    {
        provide: RepositoryToken.ArticleRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(ArticleEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },
];
