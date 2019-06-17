import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { SharedModule } from '../shared/shared.module';

import { articleProviders } from './article.provider';
import { ArticleController } from './controller/article.controller';
import { ArticleStatisticsController } from './controller/article.statistics.controller';
import { ArticleMessageService } from './service/article.message.service';
import { ArticleService } from './service/article.service';
import { StatisticsMessageService } from './service/article.statistics.message.service';

@Module({
    controllers: [ArticleController, ArticleStatisticsController],
    imports: [DatabaseModule, SharedModule],
    providers: [ArticleService, ArticleMessageService, StatisticsMessageService, ...articleProviders],
    exports: [ArticleService]
})
export class ArticleModule {}
