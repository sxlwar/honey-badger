import { HttpStatus, Injectable } from '@nestjs/common';

import { MessageService } from '../../shared/service/message.service';

@Injectable()
export class AuthMessageService extends MessageService {
    readonly AUTH_FAIL = 'Auth FAILED';

    getHttpExceptionMessage(status: number, path: string): string {
        switch (status) {
            case HttpStatus.FORBIDDEN:
                return this.AUTH_FAIL;
            default:
                return null;
        }
    }
}
