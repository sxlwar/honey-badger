import { HttpModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { ConfigVar } from './shared/config/config.enum';
import { ConfigService } from './shared/config/config.service';
import { SharedModule } from './shared/shared.module';
import { UploadModule } from './upload/upload.module';
import { AngularUniversalModule, applyDomino } from '@nestjs/ng-universal';
import { join } from 'path';
import * as domino from 'domino';
import { enableProdMode } from '@angular/core';

const BROWSER_DIR = join(process.cwd(), 'web/browser');

// applyDomino 这个方法上没有加navigator, 这里手动加上
(function patchWindow() {
    const tpl = join(BROWSER_DIR, 'index.html');
    const win = domino.createWindow(tpl);

    global['navigator'] = win.navigator;

    applyDomino(global, tpl);
})();

enableProdMode();

@Module({
    imports: [
        SharedModule,
        ArticleModule,
        HttpModule.register({
            timeout: 3000,
        }),
        CommentModule,
        AuthModule,
        UploadModule,
        AngularUniversalModule.forRoot({
            viewsPath: BROWSER_DIR,
            bundle: require('./../web/server/main.js'),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    /**
     * * These variables are static because we are not going to be creating any instance of AppModule
     * * so making these static allows us to grab them later.
     */
    public static port: number | string;
    public static host: string;
    public static isDev: boolean;
    public static database: string;
    public static databasePwd: string;

    constructor(private readonly _configService: ConfigService) {
        this.initialConfigValue();
    }

    private initialConfigValue() {
        AppModule.port = AppModule.normalizePort(this._configService.getConfigVariable(ConfigVar.PORT));
        AppModule.host = this._configService.getConfigVariable(ConfigVar.HOST);
        AppModule.isDev = this._configService.isDevelopment;
        AppModule.database = this._configService.get('DATABASE');
        AppModule.databasePwd = this._configService.get('DATABASE_PASSWORD');
    }

    /**
     * Return the normalized port number
     * @param {number | string} param
     * @returns {number | string}
     */
    private static normalizePort(param: number | string): number | string {
        const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;

        if (isNaN(portNumber)) return param;
        else if (portNumber >= 0) return portNumber;
    }
}
