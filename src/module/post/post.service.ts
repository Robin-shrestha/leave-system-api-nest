import { EntityManager, In, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostMeta } from './entities/post-meta.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment-entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { description, tags, ...rest } = createPostDto;
    const tagsEntity = await this.findTags(tags);

    const meta = new PostMeta({
      description: description,
      rating: 0,
    });

    const post = this.postRepository.create({
      ...rest,
      meta,
      tags: tagsEntity,
    });
    const res = await this.postRepository.save(post);
    return res;
  }

  async findAll() {
    return this.postRepository.find({
      select: {
        meta: {
          description: true,
          rating: true,
        },
      },
      relations: {
        meta: true,
        tags: true,
        comment: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      select: {
        meta: {
          description: true,
          rating: true,
        },
      },
      relations: {
        tags: true,
        meta: true,
        comment: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    const { description, rating, tags, ...rest } = updatePostDto;
    const tagsEntity = await this.findTags(tags);

    const meta = new PostMeta({
      ...post.meta,
      description: description ?? post.meta.description,
      rating: rating ?? post.meta.rating,
    });

    return this.postRepository.save({
      ...post,
      ...rest,
      meta,
      tags: [...tagsEntity], // for now we just replace the tags, meant who cares its a test learn shit stuff
    });
  }

  async remove(id: number) {
    await this.postRepository.createQueryBuilder();
    await this.postRepository.delete(id);
  }

  async comment(id: number, comment: CreateCommentDto) {
    const post = await this.findOne(id);

    const commentEntity = new Comment(comment);
    await this.postRepository.save({
      ...post,
      comment: [...post.comment, commentEntity],
    });
    return commentEntity;
  }

  async findTags(id: number[]) {
    const tag = await this.entityManager.findBy(Tag, { id: In(id) });
    if (!tag) {
      throw new NotFoundException('Tag Not Found');
    }
    return tag;
  }
}
