import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  findAll() {
    return this.countryService.findAll();
  }
}
