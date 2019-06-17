import { Body, Controller, Post, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { API } from '../../shared/constant/constant';
import { EmailPipe } from '../../shared/pipes/shared.pipe';
import { SUBSCRIPTION } from '../constant/constant';
import { SubscriptionDto } from '../dto/subscription.dto';
import { SubscriptionExceptionFilter } from '../filter/subscription.filter';
import { HasSubscribedGuard } from '../guard/subscription.guard';
import { SubscriptionResponse } from '../interface/subscription.interface';
import { SubscribeService } from '../service/subscription.service';

@Controller(API + '/' + SUBSCRIPTION)
@ApiUseTags(SUBSCRIPTION)
export class SubscriptionController {
    constructor(
        private subscribeService: SubscribeService,
    ) {}

    @Post()
    @UseGuards(HasSubscribedGuard)
    @UseFilters(SubscriptionExceptionFilter)
    @UsePipes(EmailPipe)
    async getUserInfo(@Body() { email }: SubscriptionDto): Promise<SubscriptionResponse> {
        return this.subscribeService.addSubscription(email).then(id => ({ id: id + 1000 }));
    }
}
