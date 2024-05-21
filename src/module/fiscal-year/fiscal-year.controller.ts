import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';

import { Role } from 'src/types/enums';
import { PaginationDto } from 'src/utils';
import { NonWhiteListedValidation } from 'src/pipes';
import { FiscalYearService } from './fiscal-year.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';

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
  findAll(
    @Query(NonWhiteListedValidation)
    paginationDto?: PaginationDto,
  ) {
    return this.fiscalYearService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.fiscalYearService.findOne(+id);
  }
}
