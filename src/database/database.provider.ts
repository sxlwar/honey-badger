import { createConnection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.enum';

export const databaseProviders = [
    {
        provide: RepositoryToken.DbConnectionToken,
        useFactory: async () =>
            await createConnection({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: 'ratel',
                database: 'test',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
    },
];
