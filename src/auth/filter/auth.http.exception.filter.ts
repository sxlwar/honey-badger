import { Catch, HttpException } from '@nestjs/common';

import { HttpExceptionFilter } from '../../shared/filter/http-exception.filter';

import { AuthMessageService } from '../service/auth.message.service';

@Catch(HttpException)
export class AuthHttpExceptionFilter extends HttpExceptionFilter {
    constructor(public _msgService: AuthMessageService) {
        super(_msgService);
    }
}
