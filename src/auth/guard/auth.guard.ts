import { CanActivate, ExecutionContext, Inject, Injectable, RequestMethod } from '@nestjs/common';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryToken } from '../../shared/config/config.enum';
import { Repository } from 'typeorm';

import { UserEntity } from '../entity/auth.entity';
import { ValidStoreOperate } from '../constant/constant';
import { ArticleEntity } from '../../article/entity/article.entity';

@Injectable()
export class IsLoginStateGuard implements CanActivate {
    constructor(@Inject(RepositoryToken.AuthRepositoryToken) private readonly userRepository: Repository<UserEntity>) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { id } = request.body;

        return from(this.userRepository.findOne({ githubId: id })).pipe(map(user => !!user && !user.isLogout));
    }
}

@Injectable()
export class IsValidStoreActionGuard implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { operate } = request.body;

        return [ValidStoreOperate.ADD, ValidStoreOperate.REMOVE, ValidStoreOperate.CLEAR].indexOf(operate) !== -1;
    }
}

@Injectable()
export class ArticleCanStoredGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.ArticleRepositoryToken) private readonly articleRepository: Repository<ArticleEntity>,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { articleId } = request.body;

        return from(this.articleRepository.findOne({ id: articleId })).pipe(
            map(article => !!article && !article.isDeleted),
        );
    }
}
