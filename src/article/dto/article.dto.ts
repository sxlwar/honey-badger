import { ApiModelProperty, ApiModelPropertyOptional, ApiUseTags } from '@nestjs/swagger';
import { ARTICLE } from '../constant/article.constant';

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
}
