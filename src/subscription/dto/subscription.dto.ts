import { ApiModelProperty, ApiUseTags } from '@nestjs/swagger';
import { SUBSCRIPTION } from '../constant/constant';

@ApiUseTags(SUBSCRIPTION)
export class SubscriptionDto {
    @ApiModelProperty()
    readonly email: string;
}
