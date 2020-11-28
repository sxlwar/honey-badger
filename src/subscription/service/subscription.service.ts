import { Inject, Injectable } from '@nestjs/common';
import { send, setApiKey } from '@sendgrid/mail';
import * as moment from 'moment';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { Category } from '../../article/interface/article.interface';
import { ArticleService } from '../../article/service/article.service';
import { RepositoryToken } from '../../shared/config/config.enum';
import { ConfigService } from '../../shared/config/config.service';
import { SubscriptionEntity } from '../entity/subscription.entity';



interface DynamicContent {
    href: string;
    title: string;
    summary: string;
    thumbnail: string;
}

@Injectable()
export class SubscribeService {
    private readonly templateId = 'd-4c2338f502da47c2a18712a2c67851f1';

    private prodAddress = 'https://blog.chtoma.com';
    private clientAddress = 'http://localhost:4200';
    private serverAddress = 'http://localhost:3000';

    constructor(
        private configService: ConfigService,
        private articleService: ArticleService,
        @Inject(RepositoryToken.SubscriptionToken)
        private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    ) {
        setApiKey(this.configService.sendgridApiKey);
        this.sendNotification();
    }

    async addSubscription(email: string): Promise<number> {
        return this.subscriptionRepository
            .save({ email, subscribedAt: moment().format(this.configService.dateFormat) })
            .then(res => res.id);
    }

    /**
     * @description sendgrid dynamicTemplateData must use this structure
     * {
     *   key: { key: value },
     *   .....
     * }
     * if we change it to
     * {
     *  data: DynamicContent[]
     * }
     * can not work.
     */
    private sendNotification(): void {
        const template = this.createTemplateData();
        const email = from(this.subscriptionRepository.find()).pipe(map(data => data.map(item => item.email)));

        template
            .pipe(
                switchMap(([first, second, third]) =>
                    email.pipe(
                        map(to => ({
                            to,
                            from: { email: 'hijavascript@163.com', name: 'Angular完全开发手册' },
                            subject: '最新文章',
                            templateId: this.templateId,
                            dynamicTemplateData: { first, second, third },
                        })),
                    ),
                ),
            )
            .subscribe(message => send(message));
    }

    private createTemplateData(): Observable<DynamicContent[]> {
        return this.articleService.getPendingArticles().pipe(
            map(articles =>
                articles.map(({ id, summary, title, thumbnail, category }) => ({
                    title,
                    summary: summary,
                    thumbnail: thumbnail || this.getThumbnail(category),
                    href: `${this.configService.notProd ? this.serverAddress : this.prodAddress}/home/${id}`,
                })),
            ),
        );
    }

    private getThumbnail(category: Category[]): string {
        const imageMap = {
            angular: 'landscape_0.jpeg',
            typescript: 'landscape_1.jpeg',
            rxjs: 'landscape_2.jpeg',
            javascript: 'landscape_3.jpeg',
            other: 'landscape_4.jpeg',
        };

        let address = '';

        if (this.configService.isProd) {
            address = this.prodAddress;
        } else if (this.configService.isTest) {
            address = this.serverAddress;
        } else {
            address = this.clientAddress;
        }

        return `${address}/assets/images/${imageMap[category[category.length - 1].toLowerCase()] ||
            'landscape_5.jpeg'}`;
    }
}
