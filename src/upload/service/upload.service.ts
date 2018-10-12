import { Injectable } from '@nestjs/common';
import { QiniuToken } from '../../shared/config/config.enum';
import * as qiniu from 'qiniu';

@Injectable()
export class UploadService {
    private mac: any;
    constructor() {
        this.initConfig();
    }

    initConfig() {
        qiniu.conf.ACCESS_KEY = QiniuToken.accessKey;
        qiniu.conf.SECRET_KEY = QiniuToken.secretKey;

        this.mac = new qiniu.auth.digest.Mac(QiniuToken.accessKey, QiniuToken.secretKey);
    }

    async upToken(name: string): Promise<string> {
        const putPolicy = new qiniu.rs.PutPolicy({ scope: QiniuToken.bucket + ':' + name }); // 防止文件被串改，前端使用此token上传的文件名称必须与 name 一致

        return await putPolicy.uploadToken(this.mac);
    }
}
