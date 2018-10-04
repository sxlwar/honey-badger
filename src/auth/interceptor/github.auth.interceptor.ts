import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';

import { ConfigService } from '../../shared/config/config.service';
import * as uuid from 'uuid/v4';

@Injectable()
export class RedirectToGithubAuthInterceptor implements NestInterceptor {
    readonly githubAuthURI = 'https://github.com/login/oauth/authorize';

    constructor(private readonly configService: ConfigService) {}

    intercept(context: ExecutionContext, stream$: Observable<any>): Observable<any> {
        const response = context.switchToHttp().getResponse();
        const authConfig = this.configService.authConfig;

        response.redirect(
            `${this.githubAuthURI}?client_id=${authConfig.clientId}&redirect_uri=${
                authConfig.redirect
            }/auth/github/code&scope=user&state=${this.getUUId()}`,
        );

        return stream$;
    }

    private getUUId(): string {
        return uuid().replace(/-/g, '');
    }
}
