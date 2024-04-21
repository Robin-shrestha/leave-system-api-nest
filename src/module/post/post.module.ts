import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tag } from './entities/tag.entity';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PostController } from './post.controller';
import { Comment } from './entities/comment-entity';
import { PostMeta } from './entities/post-meta.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMeta, Comment, Tag]),
    AuthModule,
  ],
  controllers: [PostController],
  providers: [PostService, JwtService],
})
export class PostModule {}
