import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from 'src/types/enums';
import { HolidaysService } from './holidays.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { Holidays } from './entities/holiday.entity';
import { Response } from 'src/utils';

@ApiBearerAuth()
@ApiTags('Holiday')
@Controller('holiday')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a Holiday' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: Response<Holidays>,
  })
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidaysService.create(createHolidayDto);
  }

  @Get()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Find all Holidays' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<Holidays[]>,
  })
  findAll() {
    // TODO implement filter (filter with fiscal year) and pagination
    return this.holidaysService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Find a Holiday' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<Holidays>,
  })
  findOne(@Param('id') id: string) {
    return this.holidaysService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a Holiday' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<Holidays>,
  })
  update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidaysService.update(+id, updateHolidayDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a Holiday' })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('id') id: string) {
    return this.holidaysService.remove(+id);
  }
}
