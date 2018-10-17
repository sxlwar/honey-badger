import { HttpStatus, Injectable } from '@nestjs/common';

import { CRUDVar } from '../../shared/constant/constant';
import { MessageService } from '../../shared/service/message.service';

@Injectable()
export class ArticleMessageService extends MessageService {
    readonly CAN_NOT_FIND_ARTICLE_MSG = 'Can not find article. Article is not existed or it has been deleted.';
    readonly DUPLICATE_ARTICLE_MSG = 'Duplicate article. Please modify the title of this article and try again.';

    getHttpExceptionMessage(status: number, path: string): string {
        switch (status) {
            case HttpStatus.FORBIDDEN:
                return this.getForbiddenMessage(path);
            default:
                return null;
        }
    }

    private getForbiddenMessage(path: string): string {
        const paths = path.split('/').filter(item => !!item);

        if (paths[paths.length - 1] === CRUDVar.CREATE) {
            return this.DUPLICATE_ARTICLE_MSG;
        } else {
            return this.CAN_NOT_FIND_ARTICLE_MSG;
        }
    }
}
