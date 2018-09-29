import { Injectable } from '@nestjs/common';

import { MessageService } from 'shared/service/message.service';

@Injectable()
export class StatisticsMessageService extends MessageService {
    readonly ARTICLE_NOT_EXIST_MSG = 'The statistics does not exist';

    getHttpExceptionMessage(_status: number, _path: string): string {
        return this.ARTICLE_NOT_EXIST_MSG;
    }
}
