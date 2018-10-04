import { Provider } from '@nestjs/common';

import { Connection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.enum';
import { AuthEntity } from './entity/auth.entity';

export const authProviders: Provider[] = [
    {
        provide: RepositoryToken.AuthRepositoryToken,
        useFactory: (connection: Connection) => connection.getRepository(AuthEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },
];
