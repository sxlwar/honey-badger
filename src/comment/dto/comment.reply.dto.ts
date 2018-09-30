import { ApiModelProperty, ApiUseTags } from '@nestjs/swagger';

import { REPLY } from '../constant/constant';

@ApiUseTags(REPLY)
export class ReplyDto {
    @ApiModelProperty()
    readonly fromUser: string;

    @ApiModelProperty()
    readonly toUser: string;

    @ApiModelProperty()
    readonly content: string;

    @ApiModelProperty()
    readonly commentId: number;
}
