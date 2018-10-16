import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiUseTags } from '@nestjs/swagger';

import { CRUDVar } from '../../shared/constant/constant';
import { UploadDto } from '../../upload/dto/upload.dto';
import { UploadService } from '../../upload/service/upload.service';

import { UPLOAD } from '../constant/constant';
import { UploadTokenResponse } from '../interface/upload.interface';
import { API } from '../../shared/constant/constant';

@Controller(API + '/' + UPLOAD)
@ApiUseTags(UPLOAD)
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post(CRUDVar.CREATE)
    @ApiCreatedResponse({ description: 'Token create success' })
    async generateToken(@Body() upload: UploadDto): Promise<UploadTokenResponse> {
        return this.uploadService.upToken(upload.name).then(uploadToken => ({ uploadToken }));
    }
}
