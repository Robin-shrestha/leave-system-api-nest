import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FiscalYearService } from './fiscal-year.service';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';

@Controller('fiscal-year')
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  @Post()
  create(@Body() createFiscalYearDto: CreateFiscalYearDto) {
    return this.fiscalYearService.create(createFiscalYearDto);
  }

  @Get()
  findAll() {
    return this.fiscalYearService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiscalYearService.findOne(+id);
  }
}
