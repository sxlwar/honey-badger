import { CanActivate, ExecutionContext, Inject, Injectable, RequestMethod } from '@nestjs/common';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RepositoryToken } from '../../shared/config/config.provider';
import { Repository } from 'typeorm';

import { ArticleEntity } from '../entity/article.entity';

@Injectable()
export class ArticleAvailableGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.ArticleRepositoryToken) private readonly articleRepository: Repository<ArticleEntity>,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const id = request.method === RequestMethod[0] ? request.params.id : request.body.id;

        return from(this.articleRepository.findOne({ id })).pipe(map(article => !!article && !article.isDeleted));
    }
}

@Injectable()
export class ArticleNotRepeatedGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.ArticleRepositoryToken) private readonly articleRepository: Repository<ArticleEntity>,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const { author, title } = request.body;
        const result = this.articleRepository.find({ title });

        return from(result).pipe(
            map(res => {
                if (!res.length) {
                    return true;
                } else {
                    const articles = res.filter(item => item.author === author);

                    return !articles.length;
                }
            }),
        );
    }
}
