import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

import { ArticleDto, ArticleUpdateDto, ArticleDeleteDto, ArticleSearchDto } from '../dto/article.dto';
import { ArticleEntity } from '../entity/article.entity';
import { ArticleHttpExceptionFilter } from '../filter/article.http.exception.filter';
import { ArticleAvailableGuard, ArticleNotRepeatedGuard } from '../guard/article.guard';
import { ArticleService } from '../service/article.service';
import { CRUDVar } from '../../shared/constant/constant';
import { ARTICLE } from '../constant/constant';
import { Observable } from 'rxjs';
import { ArticleOverview } from '../interface/article.interface';

@Controller(ARTICLE)
@ApiUseTags(ARTICLE)
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @Post(CRUDVar.SEARCH)
    @UseFilters(ArticleHttpExceptionFilter)
    getArticles(@Body() conditions: ArticleSearchDto): Observable<ArticleEntity[] | ArticleOverview[]> {
        return this.articleService.findArticles(conditions);
    }

    @Get(':id')
    @UseFilters(ArticleHttpExceptionFilter)
    @UseGuards(ArticleAvailableGuard)
    getArticleById(@Param('id', new ParseIntPipe()) id: number): Promise<ArticleEntity> {
        return this.articleService.findArticleById(id);
    }

    @Post(CRUDVar.CREATE)
    @UseFilters(ArticleHttpExceptionFilter)
    @UseGuards(ArticleNotRepeatedGuard)
    @ApiCreatedResponse({ description: 'Article created success.' })
    addArticle(@Body() article: ArticleDto): Observable<number> {
        return this.articleService.createArticle(article);
    }

    @Put(CRUDVar.UPDATE)
    @UseFilters(ArticleHttpExceptionFilter)
    @UseGuards(ArticleAvailableGuard)
    @ApiOkResponse({ description: 'Updated success.' })
    @ApiNotFoundResponse({ description: 'Target article not found.' })
    async updateArticle(@Body() info: ArticleUpdateDto): Promise<boolean> {
        return this.articleService.updateArticle(info);
    }

    @Delete(CRUDVar.DELETE)
    @UseFilters(ArticleHttpExceptionFilter)
    @UseGuards(ArticleAvailableGuard)
    async deleteArticle(@Body() info: ArticleDeleteDto): Promise<boolean> {
        return this.articleService.deleteArticle(info.id);
    }
}
