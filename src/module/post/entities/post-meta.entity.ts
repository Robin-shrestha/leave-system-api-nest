import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class PostMeta extends AbstractEntity<PostMeta> {
  @Column()
  rating: number;

  @Column({ nullable: false })
  description: string;
}
