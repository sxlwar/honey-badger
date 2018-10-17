import { ApiModelProperty, ApiModelPropertyOptional, ApiUseTags } from '@nestjs/swagger';

import { ARTICLE } from '../constant/constant';

@ApiUseTags(ARTICLE)
export class ArticleDto {
    @ApiModelProperty()
    readonly author: string;

    @ApiModelProperty()
    readonly title: string;

    @ApiModelPropertyOptional()
    readonly subtitle?: string;

    @ApiModelProperty()
    readonly content: string;

    @ApiModelProperty()
    readonly isPublished: boolean;

    @ApiModelProperty()
    readonly category: string[];

    @ApiModelProperty()
    readonly isOriginal: boolean;

    @ApiModelProperty()
    readonly userId: number;
}

@ApiUseTags(ARTICLE)
export class ArticleUpdateDto {
    @ApiModelProperty()
    readonly id: number;

    @ApiModelProperty()
    readonly content: string;
}

@ApiUseTags(ARTICLE)
export class ArticleDeleteDto {
    @ApiModelProperty()
    readonly id: number;
}

@ApiUseTags(ARTICLE)
export class ArticleSearchDto {
    @ApiModelPropertyOptional()
    readonly author: string;

    @ApiModelPropertyOptional()
    readonly title: string;

    @ApiModelPropertyOptional()
    readonly category: string[];

    @ApiModelPropertyOptional()
    readonly offset: number;

    @ApiModelPropertyOptional()
    readonly limit: number;

    @ApiModelPropertyOptional()
    readonly isOverview: boolean;

    @ApiModelPropertyOptional()
    readonly rank: 'enjoy' | 'view' | 'stored';
}

@ApiUseTags(ARTICLE)
export class ArticleSeriesDto {
    @ApiModelProperty()
    readonly series: 'angular' | 'typescript' | 'rxjs' | 'javascript' | 'other';
}
