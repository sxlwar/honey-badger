import { Catch, HttpException } from '@nestjs/common';

import { HttpExceptionFilter } from '../../shared/filter/http-exception.filter';

import { CommentMessageService } from '../service/comment.message.service';

@Catch(HttpException)
export class CommentHttpExceptionFilter extends HttpExceptionFilter {
    constructor(public _msgService: CommentMessageService) {
        super(_msgService);
    }
}
