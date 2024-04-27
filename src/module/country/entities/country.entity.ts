import { Column, Entity } from 'typeorm';

@Entity()
export class Country {
  @Column({ nullable: false, unique: true, length: 100 })
  country: string;

  @Column({
    primary: true,
    nullable: false,
    unique: true,
    length: 2,
    name: 'country_code',
  })
  countryCode: string;
}
