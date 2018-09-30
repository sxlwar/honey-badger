import { Body, Controller, Get, Param, ParseIntPipe, Put, UseFilters, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { CRUDVar } from '../../shared/constant/constant';
import { STATISTICS } from '../constant/constant';
import { ArticleStatisticsDto } from '../dto/article.statistics.dto';
import { ArticleStatisticsEntity } from '../entity/article.statistics.entity';
import { StatisticsHttpExceptionFilter } from '../filter/article.statistics.http.exception.filter';
import { StatisticsAvailableGuard } from '../guard/article.statistics.guard';
import { ArticleService } from '../service/article.service';

@Controller(STATISTICS)
@ApiUseTags(STATISTICS)
export class ArticleStatisticsController {
    constructor(private articleService: ArticleService) {}

    @Get(':id')
    @UseFilters(StatisticsHttpExceptionFilter)
    @UseGuards(StatisticsAvailableGuard)
    async getStatisticsById(@Param('id', new ParseIntPipe()) id: number): Promise<ArticleStatisticsEntity> {
        return this.articleService.getStatisticsById(id);
    }

    @Put(CRUDVar.UPDATE)
    @UseFilters(StatisticsHttpExceptionFilter)
    @UseGuards(StatisticsAvailableGuard)
    async updateStatistics(@Body() data: ArticleStatisticsDto): Promise<boolean> {
        return this.articleService.updateStatistics(data);
    }
}
