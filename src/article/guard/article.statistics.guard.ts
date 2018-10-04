import { CanActivate, ExecutionContext, Inject, Injectable, RequestMethod } from '@nestjs/common';

import { Repository } from 'typeorm';

import { RepositoryToken } from '../../shared/config/config.enum';
import { ArticleStatisticsEntity } from '../entity/article.statistics.entity';

@Injectable()
export class StatisticsAvailableGuard implements CanActivate {
    constructor(
        @Inject(RepositoryToken.ArticleStatisticsRepositoryToken)
        private readonly statisticsRepository: Repository<ArticleStatisticsEntity>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const id = request.method === RequestMethod[0] ? request.params.id : request.body.id;

        return await this.statisticsRepository
            .createQueryBuilder('statistics')
            .leftJoinAndSelect('statistics.article', 'article')
            .where('statistics.id = :id', { id })
            .getOne()
            .then(statistics => !statistics.article.isDeleted);
    }
}
