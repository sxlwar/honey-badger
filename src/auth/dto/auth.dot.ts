import { ApiModelProperty, ApiUseTags } from '@nestjs/swagger';
import { AUTH } from '../constant/constant';

@ApiUseTags(AUTH)
export class LogoutDto {
    @ApiModelProperty()
    readonly id: number;
}

@ApiUseTags(AUTH)
export class UserDto {
    @ApiModelProperty()
    readonly id: number;
}

@ApiUseTags(AUTH)
export class StoreDto {
    @ApiModelProperty()
    readonly id: number;

    @ApiModelProperty()
    readonly articleId?: number; // operate 为 clear 时不需要

    @ApiModelProperty()
    readonly operate: 'add' | 'remove' | 'clear';
}

@ApiUseTags(AUTH)
export class BookmarkDto {
    @ApiModelProperty()
    readonly id: number;
}
