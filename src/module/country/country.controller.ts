import { Role } from 'src/types/enums';
import { CountryService } from './country.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateCountryDto } from './dto/create-country.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Country } from './entities/country.entity';
import { PaginatedResponse } from 'src/utils';

@ApiBearerAuth()
@ApiTags('Country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a Country' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Delete(':countryCode')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a Country' })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  delete(@Param('countryCode') countryCode: string) {
    return this.countryService.delete(countryCode);
  }

  @Get()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Delete a Country' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: PaginatedResponse<Country[]>,
  })
  findAll() {
    return this.countryService.findAll();
  }
}
