import { Injectable, ArgumentMetadata, ValidationPipe } from '@nestjs/common';

@Injectable()
export class NonWhiteListedValidation extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    return super.transform(value, metadata);
  }
}
