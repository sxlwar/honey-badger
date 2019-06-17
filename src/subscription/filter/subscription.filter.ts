import { Catch, HttpException } from '@nestjs/common';

import { HttpExceptionFilter } from '../../shared/filter/http-exception.filter';
import { SubscriptionMessageService } from '../service/subscription.message.service';


@Catch(HttpException)
export class SubscriptionExceptionFilter extends HttpExceptionFilter {
    constructor(public _msgService: SubscriptionMessageService) {
        super(_msgService);
    }
}
