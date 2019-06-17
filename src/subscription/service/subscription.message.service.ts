import { Injectable, HttpStatus } from '@nestjs/common';

import { MessageService } from '../../shared/service/message.service';

@Injectable()
export class SubscriptionMessageService extends MessageService {
    readonly DO_NOT_REPEAT_SUBSCRIBE = 'You have subscribed!';

    readonly TO_MANY_REQUESTS = 'Too many subscribe action from this IP, please try again later.';

    readonly UNKNOWN_REASON = 'Failed with unknown reason.'

    getHttpExceptionMessage(status: number, path: string, extra?: any): string {
        switch(status) {
            case HttpStatus.FORBIDDEN:
                return this.DO_NOT_REPEAT_SUBSCRIBE;
            case HttpStatus.TOO_MANY_REQUESTS: // !FIXME: For rateLimit middleware, but can't be intercepted by filer.
                return this.TO_MANY_REQUESTS;
            default:
                return extra && extra.message || this.UNKNOWN_REASON;
        }

    }
}
