import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostMeta } from './entities/post-meta.entity';
import { Comment } from './entities/comment-entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostMeta, Comment, Tag])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
