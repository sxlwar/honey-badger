import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';

import * as moment from 'moment';

import { MessageService } from '../service/message.service';

export class HttpExceptionFilter implements ExceptionFilter {
    constructor(public readonly messageService: MessageService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const status = exception.getStatus();
        const message = this.messageService.getHttpExceptionMessage(status, request.url, exception.message) || response.message.message;

        response.status(status).json({
            statusCode: status,
            timestamp: moment().toISOString(),
            path: request.url,
            message,
        });
    }
}
