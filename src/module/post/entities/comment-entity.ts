import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @Column({ nullable: false })
  comment: string;

  @ManyToOne(() => Post, (post) => post.comment)
  post: Post;
}
