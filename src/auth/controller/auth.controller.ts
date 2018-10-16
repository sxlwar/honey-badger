import { Body, Controller, Get, Post, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { AUTH, CODE, CONFIG, GITHUB, LOGOUT, STORE, USER, BOOKMARK } from '../constant/constant';
import { LogoutDto, StoreDto, UserDto, BookmarkDto } from '../dto/auth.dot';
import { UserEntity } from '../entity/auth.entity';
import { AuthHttpExceptionFilter } from '../filter/auth.http.exception.filter';
import { ArticleCanStoredGuard, IsLoginStateGuard, IsValidStoreActionGuard } from '../guard/auth.guard';
import { RedirectToGithubAuthInterceptor } from '../interceptor/github.auth.interceptor';
import { GithubAuthConfigResponse, LogoutResponse, StoreResponse, BookmarkResponse } from '../interface/auth.interface';
import { AuthService } from '../service/auth.service';
import { API } from '../../shared/constant/constant';

@Controller(API + '/' + AUTH)
@ApiUseTags(AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    /**
     * 直接被重定向
     */
    @Get(GITHUB)
    @UseInterceptors(RedirectToGithubAuthInterceptor)
    @UseFilters(AuthHttpExceptionFilter)
    githubAuth() {}

    /**
     * 请求生成url的配置
     */
    @Get(GITHUB + '/' + CONFIG)
    @UseFilters(AuthHttpExceptionFilter)
    githubConfig(): Partial<GithubAuthConfigResponse> {
        return this.authService.getGithubConfig();
    }

    @Get(GITHUB + '/' + CODE)
    @UseFilters(AuthHttpExceptionFilter)
    githubAuthCode(@Query('code') code: string, @Query('state') state: string): Observable<UserEntity> {
        return this.authService.authGithubAccount(code, state);
    }

    @Post(USER)
    @UseFilters(AuthHttpExceptionFilter)
    getUserInfo(@Body() data: UserDto): Promise<UserEntity> {
        return this.authService.findUser(data.id);
    }

    @Post(LOGOUT)
    @UseFilters(AuthHttpExceptionFilter)
    logout(@Body() data: LogoutDto): Promise<LogoutResponse> {
        return this.authService.logout(data.id);
    }

    @Post(STORE)
    @UseFilters(AuthHttpExceptionFilter)
    @UseGuards(IsLoginStateGuard, IsValidStoreActionGuard, ArticleCanStoredGuard)
    store(@Body() data: StoreDto): Promise<StoreResponse> {
        return this.authService.store(data);
    }

    @Post(BOOKMARK)
    @UseFilters(AuthHttpExceptionFilter)
    @UseGuards(IsLoginStateGuard)
    getBookmarks(@Body() data: BookmarkDto): Promise<BookmarkResponse> {
        return this.authService.getBookmarks(data);
    }
}
