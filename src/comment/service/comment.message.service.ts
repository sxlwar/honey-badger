import { HttpStatus, Injectable } from '@nestjs/common';

import { CRUDVar } from '../../shared/constant/constant';
import { MessageService } from '../../shared/service/message.service';

@Injectable()
export class CommentMessageService extends MessageService {
    readonly CAN_NOT_FIND_COMMENTS_MSG = 'Can not find comments.';
    readonly ADD_COMMENT_FAIL = 'Create comment fail, please try again later.';

    getHttpExceptionMessage(status: number, path: string): string {
        switch (status) {
            case HttpStatus.FORBIDDEN:
                return this.getForbiddenMessage(path);
            default:
                return null;
        }
    }

    private getForbiddenMessage(path: string): string {
        const subPath = path.split('/').filter(item => !!item)[1];

        if (subPath === CRUDVar.CREATE) {
            return this.ADD_COMMENT_FAIL;
        } else {
            return this.CAN_NOT_FIND_COMMENTS_MSG;
        }
    }
}
