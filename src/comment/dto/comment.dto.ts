import { ApiModelProperty, ApiUseTags } from '@nestjs/swagger';

import { COMMENT } from '../constant/constant';

@ApiUseTags(COMMENT)
export class CommentDto {
    @ApiModelProperty()
    readonly username: string;

    @ApiModelProperty()
    readonly content: string;

    @ApiModelProperty()
    readonly articleId: number;
}

@ApiUseTags(COMMENT)
export class EnjoyCommentDto {
    @ApiModelProperty()
    readonly commentId: number;

    @ApiModelProperty()
    readonly enjoy: number;
}

@ApiUseTags(COMMENT)
export class CommentDeleteDto {
    @ApiModelProperty()
    readonly id: number;
}
