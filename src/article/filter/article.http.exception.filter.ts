import { Catch, HttpException } from '@nestjs/common';

import { HttpExceptionFilter } from '../../shared/filter/http-exception.filter';

import { ArticleMessageService } from '../service/article.message.service';

@Catch(HttpException)
export class ArticleHttpExceptionFilter extends HttpExceptionFilter {
    constructor(public _msgService: ArticleMessageService) {
        super(_msgService);
    }
}
