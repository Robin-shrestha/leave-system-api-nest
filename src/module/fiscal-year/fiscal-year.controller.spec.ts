import { Test, TestingModule } from '@nestjs/testing';
import { FiscalYearController } from './fiscal-year.controller';
import { FiscalYearService } from './fiscal-year.service';

describe('FiscalYearController', () => {
  let controller: FiscalYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FiscalYearController],
      providers: [FiscalYearService],
    }).compile();

    controller = module.get<FiscalYearController>(FiscalYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
