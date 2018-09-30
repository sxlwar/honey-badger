import { Catch, HttpException } from '@nestjs/common';

import { HttpExceptionFilter } from '../../shared/filter/http-exception.filter';

import { StatisticsMessageService } from '../service/article.statistics.message.service';

@Catch(HttpException)
export class StatisticsHttpExceptionFilter extends HttpExceptionFilter {
    constructor(public _msgService: StatisticsMessageService) {
        super(_msgService);
    }
}
