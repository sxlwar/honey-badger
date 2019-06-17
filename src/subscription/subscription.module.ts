import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import * as rateLimit from 'express-rate-limit';

import { ArticleModule } from '../article/article.module';
import { DatabaseModule } from '../database/database.module';
import { API } from '../shared/constant/constant';
import { SharedModule } from '../shared/shared.module';
import { SUBSCRIPTION } from './constant/constant';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionMessageService } from './service/subscription.message.service';
import { SubscribeService } from './service/subscription.service';
import { subscriptionProviders } from './subscription.provider';

@Module({
    imports: [DatabaseModule, SharedModule, ArticleModule],
    providers: [...subscriptionProviders, SubscribeService, SubscriptionMessageService],
    controllers: [SubscriptionController],
})
export class SubscriptionModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(new rateLimit({ windowMs: 5 * 1000, max: 1 }))
            .forRoutes({ path: API + '/' + SUBSCRIPTION, method: RequestMethod.POST });
    }
}
