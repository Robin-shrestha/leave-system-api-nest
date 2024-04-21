import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Users extends AbstractEntity<Users> {
  @Column({ length: 100 })
  username: string;

  @Column({ length: 150 })
  email: string;
}
