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

    @ApiModelProperty()
    readonly userId: number;
}

@ApiUseTags(COMMENT)
export class EnjoyCommentDto {
    @ApiModelProperty()
    readonly commentId: number;

    @ApiModelProperty()
    readonly enjoy: number;

    @ApiModelProperty()
    readonly userId: number;
}

@ApiUseTags(COMMENT)
export class CommentDeleteDto {
    @ApiModelProperty()
    readonly id: number;

    @ApiModelProperty()
    readonly userId: number;
}
