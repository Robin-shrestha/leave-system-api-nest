import { Role } from 'src/types/enums';
import { CountryService } from './country.service';
import { Roles } from '../auth/decorators/Roles.decorator';
import { CreateCountryDto } from './dto/create-country.dto';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Post(':countryCode')
  @Roles(Role.ADMIN)
  delete(@Param() countryCode: string) {
    return this.countryService.delete(countryCode);
  }

  @Get()
  @Roles(Role.USER)
  findAll() {
    return this.countryService.findAll();
  }
}
