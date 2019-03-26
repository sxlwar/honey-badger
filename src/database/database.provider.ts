import { createConnection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.enum';

const isDev = process.env.NODE_ENV !== 'production';

export const databaseProviders = [
    {
        provide: RepositoryToken.DbConnectionToken,
        useFactory: async () =>
            await createConnection({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'honey_badger',
                database: isDev ? 'test' : 'honey_badger',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
    },
];
