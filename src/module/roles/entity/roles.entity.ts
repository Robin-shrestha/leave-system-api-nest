import { Column, Entity, ManyToMany } from 'typeorm';
import { Users } from 'src/module/user/entities/users.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';

@Entity()
export class Roles extends AbstractEntity<Roles> {
  @Column({ nullable: false, unique: true })
  role: string;

  @ManyToMany(() => Users, (user) => user.id)
  users: Users[];
}
