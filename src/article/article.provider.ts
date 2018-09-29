import { Provider } from '@nestjs/common';

import { Connection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.provider';
import { ArticleEntity } from './entity/article.entity';
import { ArticleStatisticsEntity } from './entity/article.statistics.entity';

export const articleProviders: Provider[] = [
    {
        provide: RepositoryToken.ArticleRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(ArticleEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },

    {
        provide: RepositoryToken.ArticleStatisticsRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(ArticleStatisticsEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },
];
