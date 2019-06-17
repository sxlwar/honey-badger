export abstract class MessageService {
    abstract getHttpExceptionMessage(httpStatus: number, path: string, extra?: any): string;
}
