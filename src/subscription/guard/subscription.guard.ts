import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from 'typeorm';

import { RepositoryToken } from '../../shared/config/config.enum';
import { SubscriptionEntity } from '../entity/subscription.entity';

@Injectable()
export class HasSubscribedGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.SubscriptionToken)
        private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { email } = request.body;

        return from(this.subscriptionRepository.findOne({ email })).pipe(map(email => !email));
    }
}
