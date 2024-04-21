import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { PostMeta } from './post-meta.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Comment } from './comment-entity';
import { Tag } from './tag.entity';

@Entity()
export class Post extends AbstractEntity<Post> {
  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @OneToOne(() => PostMeta, { cascade: true })
  @JoinColumn()
  meta: PostMeta;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comment: Comment[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable({ name: 'post_tag' })
  tags: Tag[];
}
