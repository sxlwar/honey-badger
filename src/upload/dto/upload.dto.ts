import { ApiModelProperty, ApiUseTags } from '@nestjs/swagger';

import { UPLOAD } from '../constant/constant';

@ApiUseTags(UPLOAD)
export class UploadDto {
    @ApiModelProperty()
    readonly name: string;
}
