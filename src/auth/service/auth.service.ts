import { Injectable, HttpService, Inject } from '@nestjs/common';

import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ConfigService } from '../../shared/config/config.service';
import { GithubUser } from '../interface/auth.interface';
import { RepositoryToken } from '../../shared/config/config.enum';
import { AuthEntity } from '../entity/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    private readonly githubAccessTokenURI = 'https://github.com/login/oauth/access_token';
    private readonly githubUserInfoURI = 'https://api.github.com/user';

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        @Inject(RepositoryToken.AuthRepositoryToken) private readonly userRepository: Repository<AuthEntity>,
    ) {}

    /**
     * 1、通过 github 返回的code 及配置中的 client_id，client_secret 获取 access_token;
     * 2、通过 access_token 获取用户的 github 帐户信息，保存并返回。
     * @param code 用户同意使用github 帐号登录后返回的 code
     */
    authGithubAccount(code: string, state: string): Observable<AuthEntity> {
        const config = this.configService.authConfig;
        const param = {
            client_id: config.clientId as string,
            client_secret: config.clientSecret as string,
            code,
            state,
        };

        return this.httpService
            .post(this.githubAccessTokenURI, param, { headers: { Accept: 'application/json' } })
            .pipe(
                mergeMap(({ data }) => this.getGithubUserInfo(data.access_token)),
                mergeMap(user => from(this.userRepository.save(user))),
            );
    }

    /**
     * 使用返回的 token 获取 github 用户的详细信息
     * @param token github access_token
     */
    private getGithubUserInfo(token: string): Observable<AuthEntity> {
        return this.httpService.get(`${this.githubUserInfoURI}?access_token=${token}`).pipe(
            map(res => {
                const { id, login, name, email, avatar_url } = res.data as GithubUser;

                return { id, account: login, email, avatar: avatar_url, name };
            }),
        );
    }
}
