import { Controller, Get, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { AUTH, GITHUB } from '../constant/constant';
import { AuthHttpExceptionFilter } from '../filter/auth.http.exception.filter';
import { RedirectToGithubAuthInterceptor } from '../interceptor/github.auth.interceptor';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';
import { UserEntity } from '../entity/auth.entity';

@Controller(AUTH)
@ApiUseTags(AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get(GITHUB)
    @UseInterceptors(RedirectToGithubAuthInterceptor)
    @UseFilters(AuthHttpExceptionFilter)
    githubAuth() {}

    @Get(GITHUB + '/code')
    @UseFilters(AuthHttpExceptionFilter)
    githubAuthCode(@Query('code') code: string, @Query('state') state: string): Observable<UserEntity> {
        return this.authService.authGithubAccount(code, state);
    }
}
