import { HttpService, Inject, Injectable, HttpException, BadRequestException } from '@nestjs/common';

import { ArticleEntity } from '../../article/entity/article.entity';
import { uniq } from 'lodash';
import { from, Observable, of, throwError } from 'rxjs';
import { mergeMap, mapTo, catchError } from 'rxjs/operators';
import { In, Repository } from 'typeorm';
import * as uuid from 'uuid/v4';

import { RepositoryToken } from '../../shared/config/config.enum';
import { ConfigService } from '../../shared/config/config.service';
import { ValidStoreOperate } from '../constant/constant';
import { BookmarkDto, StoreDto } from '../dto/auth.dot';
import { UserEntity } from '../entity/auth.entity';
import {
    BookmarkResponse,
    GithubAuthConfigResponse,
    GithubUser,
    LogoutResponse,
    StoreResponse,
} from '../interface/auth.interface';

@Injectable()
export class AuthService {
    private readonly githubAccessTokenURI = 'https://github.com/login/oauth/access_token';
    private readonly githubUserInfoURI = 'https://api.github.com/user';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        @Inject(RepositoryToken.AuthRepositoryToken) private readonly userRepository: Repository<UserEntity>,
        @Inject(RepositoryToken.ArticleRepositoryToken) private readonly articleRepository: Repository<ArticleEntity>,
    ) {}

    /**
     * 1、通过 github 返回的code 及配置中的 client_id，client_secret 获取 access_token;
     * 2、通过 access_token 获取用户的 github 帐户信息，保存并返回。
     * @param code 用户同意使用github 帐号登录后返回的 code
     */
    authGithubAccount(code: string, state: string): Observable<UserEntity> {
        const config = this.configService.authConfig;
        const param = {
            client_id: config.clientId as string,
            client_secret: config.clientSecret as string,
            code,
            state,
        };

        return this.httpService
            .post(this.githubAccessTokenURI, param, { headers: { Accept: 'application/json' } })
            .pipe(mergeMap(({ data }) => this.getGithubUserInfo(data.access_token)));
    }

    /**
     * 使用返回的 token 获取 github 用户的详细信息
     * @param token github access_token
     */
    private getGithubUserInfo(token: string): Observable<UserEntity> {
        return this.httpService.get(`${this.githubUserInfoURI}?access_token=${token}`).pipe(
            mergeMap(res => {
                const { id, login, name, email, avatar_url } = res.data as GithubUser;

                return from(this.findUser(id)).pipe(
                    mergeMap(user => {
                        if (user) {
                            const updatedFields = {
                                isLogout: false,
                                account: login,
                                avatar: avatar_url,
                                name: name || '',
                                email: email || '',
                            };
                            const updatedUserInfo = this.userRepository.update(user.id, updatedFields);

                            return from(updatedUserInfo).pipe(mapTo({ ...user, ...updatedFields }));
                        } else {
                            const newUser = this.userRepository.create({
                                githubId: id,
                                account: login,
                                email: email || '',
                                avatar: avatar_url,
                                name: name || '',
                                storedArticles: JSON.stringify([]),
                            });

                            return from(this.userRepository.save(newUser));
                        }
                    }),
                );
            }),
            catchError(err => {
                console.log(err.message);
                return throwError(new HttpException(err.message, err.response.status));
            }),
        );
    }

    async findUser(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({ githubId: id });
    }

    async hasLogged(id: number): Promise<boolean> {
        return this.userRepository.findOne({ id }).then(user => !!user);
    }

    async isAdmin(id: number): Promise<boolean> {
        return this.findUser(id).then(user => !!user && user.isAdmin);
    }

    getGithubConfig(): GithubAuthConfigResponse {
        const config = this.configService.authConfig;

        return { clientId: config.clientId, redirect: config.redirect, state: uuid().replace(/-/g, '') };
    }

    // 传上来的是github id;
    async logout(id: number): Promise<LogoutResponse> {
        const user = await this.findUser(id);

        return this.userRepository.update(user.id, { isLogout: true }).then(res => ({ isLogout: !!res }));
    }

    async store(info: StoreDto): Promise<StoreResponse> {
        const { id, articleId, operate } = info;
        const user = await this.userRepository.findOne({ id });
        const storedArticles: Array<number> = Array.isArray(user.storedArticles)
            ? user.storedArticles
            : JSON.parse(user.storedArticles);

        if (operate === ValidStoreOperate.ADD) {
            user.storedArticles = JSON.stringify(uniq([...storedArticles, articleId]));
        } else if (operate === ValidStoreOperate.REMOVE) {
            user.storedArticles = JSON.stringify(storedArticles.filter(item => item !== articleId));
        } else {
            user.storedArticles = JSON.stringify([]);
        }

        return this.userRepository.update(id, user).then(res => ({ isSuccess: !!res }));
    }

    async getBookmarks(data: BookmarkDto): Promise<BookmarkResponse> {
        const user = await this.userRepository.findOne({ id: data.id });
        const storedArticles: Array<number> = Array.isArray(user.storedArticles)
            ? user.storedArticles
            : JSON.parse(user.storedArticles);

        if (storedArticles.length === 0) {
            return { articles: [], count: 0 };
        } else {
            return this.articleRepository
                .findAndCount({
                    order: { createdAt: 'DESC' },
                    select: ['id', 'title', 'author', 'createdAt'],
                    where: { id: In(storedArticles), isDeleted: false },
                })
                .then(([articles, count]) => ({ articles, count }));
        }
    }
}
