import { Column, Entity, OneToMany } from 'typeorm';
import { Users } from 'src/module/user/entities/users.entity';

@Entity()
export class Country {
  @Column({ nullable: false, unique: true, length: 100, name: 'country_name' })
  countryName: string;

  @Column({
    primary: true,
    nullable: false,
    unique: true,
    length: 2,
    name: 'country_code',
  })
  countryCode: string;

  @OneToMany(() => Users, (user) => user.country)
  users: Users[];
}
