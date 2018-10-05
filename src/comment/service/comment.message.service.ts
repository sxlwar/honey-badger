import { HttpStatus, Injectable } from '@nestjs/common';

import { CRUDVar } from '../../shared/constant/constant';
import { MessageService } from '../../shared/service/message.service';

@Injectable()
export class CommentMessageService extends MessageService {
    getHttpExceptionMessage(status: number, path: string): string {
        switch (status) {
            case HttpStatus.FORBIDDEN:
                return this.getForbiddenMessage(path);

            case HttpStatus.UNAUTHORIZED:
                return 'Please login first.';

            case HttpStatus.BAD_REQUEST:
                return 'Operation is not allowed.';

            default:
                return null;
        }
    }

    private getForbiddenMessage(path: string): string {
        const subPath = path.split('/').filter(item => !!item)[1];

        if (subPath === CRUDVar.CREATE) {
            return 'Create comment fail, please try again later.';
        } else if (subPath === CRUDVar.DELETE) {
            return 'Permission denied.';
        } else {
            return 'Can not find comments.';
        }
    }
}
