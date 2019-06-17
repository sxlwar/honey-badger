import { Provider } from '@nestjs/common';

import { Connection } from 'typeorm';

import { RepositoryToken } from '../shared/config/config.enum';
import { SubscriptionEntity } from './entity/subscription.entity';

export const subscriptionProviders: Provider[] = [
    {
        provide: RepositoryToken.SubscriptionToken,
        useFactory: (connection: Connection) => connection.getRepository(SubscriptionEntity),
        inject: [RepositoryToken.DbConnectionToken],
    },
]; 