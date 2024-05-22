import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';

import { Role } from 'src/types/enums';
import { PaginatedResponse, PaginationDto, Response } from 'src/utils';
import { NonWhiteListedValidation } from 'src/pipes';
import { FiscalYearService } from './fiscal-year.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateFiscalYearDto } from './dto/create-fiscal-year.dto';
import { FiscalYear } from './entities/fiscal-year.entity';

@ApiBearerAuth()
@ApiTags('Fiscal-year')
@Controller('fiscal-year')
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a Fiscal Year Record' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  create(@Body() createFiscalYearDto: CreateFiscalYearDto) {
    return this.fiscalYearService.create(createFiscalYearDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all Fiscal Year Record' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: PaginatedResponse<FiscalYear>,
  })
  findAll(
    @Query(NonWhiteListedValidation)
    paginationDto?: PaginationDto,
  ) {
    return this.fiscalYearService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a Fiscal Year Record' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<FiscalYear>,
  })
  findOne(@Param('id') id: string) {
    return this.fiscalYearService.findOne(+id);
  }
}
