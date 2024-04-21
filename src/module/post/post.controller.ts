import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Role, Roles } from '../auth/decorators/Roles.decorator';
import { DatabaseExceptionFilter } from 'src/exception-filters/dabatase-excetion.filter';
import { LoggingInterceptorInterceptor } from 'src/interceptors/logginginterceptor/loggingInterceptor.interceptor';

@Controller('post')
@UseFilters(DatabaseExceptionFilter)
@UseInterceptors(LoggingInterceptorInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Roles()
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Roles(Role.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }
  @Patch(':id/comment')
  createComment(@Param('id') id: string, @Body() comment: CreateCommentDto) {
    return this.postService.comment(+id, comment);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
