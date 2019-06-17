import { Inject, Injectable } from '@nestjs/common';

import { intersection, orderBy } from 'lodash';
import * as moment from 'moment';
import { from, Observable, timer } from 'rxjs';
import { filter, map, mergeMap, reduce, tap, delay, switchMapTo } from 'rxjs/operators';
import { Repository, FindConditions } from 'typeorm';

import { RepositoryToken } from '../../shared/config/config.enum';
import { ConfigService } from '../../shared/config/config.service';
import { ArticleDto, ArticleSearchDto, ArticleSeriesDto, ArticleUpdateDto } from '../dto/article.dto';
import { ArticleEntity } from '../entity/article.entity';
import { ArticleStatisticsEntity } from '../entity/article.statistics.entity';
import {
    ArticleStatistics,
    ArticleUpdateResult,
    ArticleOverview,
    ArticleSeriesOverview,
    ArticleDeleteResult,
} from '../interface/article.interface';

@Injectable()
export class ArticleService {
    private notificationPendingList: number[];

    private sendNotification$: Observable<number>;

    constructor(
        @Inject(RepositoryToken.ArticleRepositoryToken) private readonly articleRepository: Repository<ArticleEntity>,
        @Inject(RepositoryToken.ArticleStatisticsRepositoryToken)
        private readonly statisticsRepository: Repository<ArticleStatisticsEntity>,
        private readonly configService: ConfigService,
    ) {
        this.initPendingList();
    }

    /**
     * ! How to implement with SQL?
     */
    findArticles(arg: Partial<ArticleSearchDto>): Observable<ArticleEntity[] | ArticleOverview[]> {
        const { offset, limit, author, title, category, isOverview, rank, allState = false, userId } = arg;
        const conditionBase = {
            order: { createdAt: 'DESC' },
            take: limit || 1000,
            skip: offset || 0,
            relations: ['statistics', 'user'],
            where: { isDeleted: false },
        } as FindConditions<ArticleEntity>;
        const condition = allState
            ? conditionBase
            : ({ ...conditionBase, where: { isPublished: true, isDeleted: false } } as FindConditions<ArticleEntity>);

        return from(this.articleRepository.find(condition)).pipe(
            mergeMap(list =>
                from(list).pipe(
                    filter(article => (author ? article.author.includes(author) : true)),
                    filter(article => (title ? article.title.includes(title) : true)),
                    filter(article => (userId ? article.userId === userId : true)),
                    filter(article => (category ? !!intersection(category, article.category).length : true)),
                    reduce((acc: ArticleEntity[], cur: ArticleEntity) => [...acc, cur], []),
                    map(articles => (isOverview ? articles.map(item => this.getOverview(item)) : articles)),
                    map(articles =>
                        rank ? (orderBy(articles, [`statistics.${rank}`], ['desc']) as ArticleOverview[]) : articles,
                    ),
                ),
            ),
        );
    }

    /**
     * ! How to implement with SQL?
     */
    getSeriesOverview(data: ArticleSeriesDto): Observable<ArticleSeriesOverview> {
        return from(this.articleRepository.find({ where: { isPublished: true } })).pipe(
            map(result => result.filter(item => item.category.includes(data.series))),
            map(result => ({ total: result.length, original: result.filter(item => item.isOriginal).length })),
        );
    }

    private getOverview(article: ArticleEntity): ArticleOverview {
        const { id, createdAt, title, category, author, content, statistics, user, isPublished, thumbnail } = article;
        const contentExceptImage = content.replace(/\!\[[\w\.\-\_]*\]\(.*\)/g, '');

        return {
            id,
            createdAt,
            title,
            author,
            statistics,
            summary: contentExceptImage.slice(0, 100),
            category: Array.isArray(category) ? category : JSON.parse(category),
            avatar: user.avatar,
            isPublished,
            thumbnail: this.forceHttps(thumbnail),
        };
    }

    private forceHttps(str: string, reg = /http:/, replaceStr = 'https:'): string {
        if (reg.test(str)) {
            let res = str;

            while (reg.exec(res)) {
                res = res.replace(reg, replaceStr);
            }

            return res;
        } else {
            return str;
        }
    }

    /**
     * Find then specified article by id. Result includes the statistics of the article.
     * Increase querying amount of the article, the increment operation is after the querying operation,
     * so the amount is less than actual result 1.
     */
    async findArticleById(articleId: number): Promise<ArticleEntity> {
        const result = await this.articleRepository.findOne({ id: articleId }, { relations: ['statistics'] });

        let { content, thumbnail } = result;

        thumbnail = this.forceHttps(thumbnail);

        content = this.forceHttps(content, /\]\(http:/, '](https:');

        const { id } = result.statistics;

        this.statisticsRepository.increment({ id }, 'view', 1);

        return { ...result, thumbnail, content };
    }

    /**
     * Save the article and initialize the statistics
     * @param data Article info passed by frontend.
     * @returns article id
     */
    createArticle(data: ArticleDto): Observable<number> {
        const statistics = this.statisticsRepository.create();
        const { category, title, subtitle, author } = data;
        const article = this.articleRepository.create({
            ...data,
            title: title.trim(),
            subtitle: subtitle.trim(),
            author: author.trim(),
            category: JSON.stringify(category),
            createdAt: moment().format(this.configService.dateFormat),
            statistics,
        });

        return from(this.articleRepository.save(article)).pipe(
            map(result => result.id),
            tap(id => this.addToPendingList(id)),
        );
    }

    async updateArticle(data: ArticleUpdateDto): Promise<ArticleUpdateResult> {
        const { id, content, isPublish = true } = data;
        const state = { isPublished: isPublish, updatedAt: moment().format(this.configService.dateFormat) };

        return this.articleRepository
            .update(id, !!content ? { ...state, content } : state)
            .then(res => ({ isUpdated: !!res }));
    }

    async deleteArticle(id: number): Promise<ArticleDeleteResult> {
        return this.articleRepository.update(id, { isDeleted: true }).then(res => ({ isDeleted: !!res }));
    }

    // ================================================Article statistics==================================================

    async getStatisticsById(id: number): Promise<ArticleStatisticsEntity> {
        return this.statisticsRepository.findOne({ id });
    }

    async updateStatistics(data: Partial<ArticleStatistics>): Promise<Partial<ArticleStatistics>> {
        const { id, enjoy, stored } = data;
        const statistics = await this.statisticsRepository.findOne({ id });

        if (enjoy) {
            statistics.enjoy += enjoy;
        }

        if (stored) {
            statistics.stored += stored;
        }

        return this.statisticsRepository.save(statistics);
    }

    // ================================================Article notification==================================================

    private initPendingList(): void {
        const startDay = moment()
            .add(1, 'day')
            .format(this.configService.dateFormat);

        // Send notifications every morning at 8am;
        this.sendNotification$ = timer(new Date(startDay + ' 08:00:00'), 24 * 60 * 60 * 1000);
        this.notificationPendingList = [];

        this.resetPendingList();
    }

    private addToPendingList(id: number): void {
        this.notificationPendingList.push(id);
    }

    private resetPendingList(): void {
        this.sendNotification$.pipe(delay(10 * 60 * 1000)).subscribe(_ => (this.notificationPendingList = []));
    }

    getPendingArticles(): Observable<ArticleOverview[]> {
        // Because of email template can display at most 3 overviews.
        const ids =
            this.notificationPendingList.length > 3
                ? this.notificationPendingList.slice(-3)
                : this.notificationPendingList;
        const articles = from(ids.length > 0 ? this.articleRepository.findByIds(ids) : []).pipe(
            filter(articles => !!articles.length),
            map(articles => articles.map(item => this.getOverview(item))),
        );

        return this.sendNotification$.pipe(switchMapTo(articles));
    }
}
