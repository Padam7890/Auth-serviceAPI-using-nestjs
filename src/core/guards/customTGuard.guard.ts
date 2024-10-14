import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

//To show custom throttling message
@Injectable()
export class BlockToManyRequest extends ThrottlerGuard {
  async onLimitExceeded(context): Promise<boolean> {
    throw new BadRequestException('Too many requests, please try again later.');
  }
}
