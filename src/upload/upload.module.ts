import { Module } from '@nestjs/common';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './service/upload.service';

@Module({
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
