import { ExecutionContext, Injectable, NestInterceptor, Inject } from '@nestjs/common';

import { Observable, of } from 'rxjs';
import { join } from 'path';
import * as express from 'express';

@Injectable()
export class HomePageInterceptor implements NestInterceptor {
    constructor() {}

    intercept(context: ExecutionContext, stream$: Observable<any>): Observable<any> {
        const response = context.switchToHttp().getResponse();
        const req = context.switchToHttp().getRequest();
        const ssrPath = join(process.cwd(), 'dist');

        console.log(ssrPath);
        // response.render(join(ssrPath, 'browser', 'index.html'), { req });

        // return of(join(ssrPath, 'browser', 'index.html'));
        return stream$;
    }
}

@Injectable()
export class StaticFileInterceptor implements NestInterceptor {
    constructor() {}

    intercept(context: ExecutionContext, stream$: Observable<any>): Observable<any> {
        const ssrPath = join(process.cwd(), 'dist');

        console.log('static file interceptor');
        express.static(join(ssrPath, 'browser'));

        return stream$;
    }
}
