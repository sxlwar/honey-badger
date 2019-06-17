import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmailPipe implements PipeTransform {
    transform(value: { email: string }, _: ArgumentMetadata) {
        const reg = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;

        if (reg.test(value.email)) {
            return value;
        }

        throw new BadRequestException('Email invalid!');
    }
}
