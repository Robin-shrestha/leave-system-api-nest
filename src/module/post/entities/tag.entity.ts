import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Tag extends AbstractEntity<Tag> {
  @Column()
  tag: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post;
}
