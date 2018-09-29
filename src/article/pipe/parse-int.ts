import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
    transform(value: string, metaData: ArgumentMetadata): number {
        const val = parseInt(value, 10);

        if (isNaN(val)) {
            throw new BadRequestException('validation failed');
        }

        return val;
    }
}
