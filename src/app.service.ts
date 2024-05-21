import { Injectable, OnModuleInit } from '@nestjs/common';

import { SeedService } from './module/seed/seed.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  onModuleInit() {
    this.seedService.seedAllWithTestData(false);
  }
}
