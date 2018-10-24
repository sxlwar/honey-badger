import { Controller, Get, UseInterceptors } from '@nestjs/common';

import { AppService } from './app.service';
import { HomePageInterceptor, StaticFileInterceptor } from './interceptor/app.interceptor';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/')
    @UseInterceptors(HomePageInterceptor)
    root() {}

    // @Get('*.*')
    // @UseInterceptors(StaticFileInterceptor)
    // page() {}
}
