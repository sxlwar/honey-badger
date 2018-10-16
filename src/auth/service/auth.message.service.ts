import { HttpStatus, Injectable } from '@nestjs/common';

import { MessageService } from '../../shared/service/message.service';
import { AUTH, STORE } from '../constant/constant';

@Injectable()
export class AuthMessageService extends MessageService {
    readonly AUTH_FAIL = '权限不足';

    getHttpExceptionMessage(status: number, path: string): string {
        switch (status) {
            case HttpStatus.FORBIDDEN:
                return this.getMessageOfPath(path);
            default:
                return this.AUTH_FAIL;
        }
    }

    private getMessageOfPath(path): string {
        switch (path) {
            case `/${AUTH}/${STORE}`:
                return `文章已被删除或${this.AUTH_FAIL}`;

            default:
                return this.AUTH_FAIL;
        }
    }
}
