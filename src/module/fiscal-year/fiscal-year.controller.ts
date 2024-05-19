import { Role } from 'src/types/enums';
import { FiscalYearService } from './fiscal-year.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('fiscal-year')
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createFiscalYearDto: CreateFiscalYearDto) {
    return this.fiscalYearService.create(createFiscalYearDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.fiscalYearService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.fiscalYearService.findOne(+id);
  }
}
