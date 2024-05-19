import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';

import { Role } from 'src/types/enums';
import { PaginationDto } from 'src/utils';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';
import { NonWhiteListedValidation } from 'src/pipes';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/Roles.decorator';
import { PaginatedResponse, Response } from 'src/utils/response';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: Response<Users>,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.USER)
  @Get()
  @ApiOperation({ summary: 'Return all Users' })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    type: PaginatedResponse<Users[]>,
  })
  findAll(
    @Query(NonWhiteListedValidation)
    paginationDto?: PaginationDto,
  ) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a User' })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    type: Response<Users>,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates a User' })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
    type: Response<Users>,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a User' })
  @ApiOkResponse({
    status: HttpStatus.ACCEPTED,
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
