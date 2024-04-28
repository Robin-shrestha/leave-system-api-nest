import { Country } from 'src/module/country/entities/country.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Roles } from 'src/module/roles/entity/roles.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Users extends AbstractEntity<Users> {
  @Column({ length: 120, nullable: false })
  username: string;

  @Column({ length: 150, nullable: false, unique: true })
  email: string;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture: string;

  @Column({ type: 'date', nullable: false, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column()
  designation: string;

  @Column()
  phone: string;

  @ManyToMany(() => Roles, (role) => role.id, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Roles[];

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: Users;

  @ManyToOne(() => Country, (country) => country.countryCode, {
    nullable: false,
  })
  @JoinColumn({
    name: 'country',
  })
  country: Country;
}
