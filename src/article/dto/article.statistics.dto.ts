import { ApiModelProperty, ApiModelPropertyOptional, ApiUseTags } from '@nestjs/swagger';

import { STATISTICS } from '../constant/constant';

@ApiUseTags(STATISTICS)
export class ArticleStatisticsDto {
    @ApiModelProperty()
    id: number;

    @ApiModelPropertyOptional()
    readonly enjoy?: number = 0;

    @ApiModelPropertyOptional()
    readonly stored?: number = 0;
}
