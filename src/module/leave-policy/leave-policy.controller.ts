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

import { Response } from 'src/utils';
import { Role } from 'src/types/enums';
import { Roles } from '../auth/decorators/Roles.decorator';
import { LeavePolicyService } from './leave-policy.service';
import { LeavePolicy } from './entities/leave-policy.entity';
import { CreateLeavePolicyDto } from './dto/create-leave-policy.dto';
import { UpdateLeavePolicyDto } from './dto/update-leave-policy.dto';

@ApiBearerAuth()
@ApiTags('Leave Policy')
@Controller('leave-policy')
export class LeavePolicyController {
  constructor(private readonly leavePolicyService: LeavePolicyService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a Leave policy' })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
  })
  create(@Body() createLeavePolicyDto: CreateLeavePolicyDto) {
    return this.leavePolicyService.create(createLeavePolicyDto);
  }

  @Get()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Find all Leave policies' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<LeavePolicy>,
  })
  findAll() {
    // TODO filter and pagination
    return this.leavePolicyService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Find a Leave policy' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<LeavePolicy>,
  })
  findOne(@Param('id') id: string) {
    return this.leavePolicyService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a Leave policy' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Response<LeavePolicy>,
  })
  update(
    @Param('id') id: string,
    @Body() updateLeavePolicyDto: UpdateLeavePolicyDto,
  ) {
    return this.leavePolicyService.update(+id, updateLeavePolicyDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a Leave policy' })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  remove(@Param('id') id: string) {
    return this.leavePolicyService.remove(+id);
  }
}
