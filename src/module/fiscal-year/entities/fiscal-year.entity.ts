import { Country } from 'src/module/country/entities/country.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Holidays } from 'src/module/holidays/entities/holiday.entity';
import { LeavePolicy } from 'src/module/leave-policy/entities/leave-policy.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity()
@Unique('unique_fiscal_year_country', ['country', 'fiscalYear'])
export class FiscalYear extends AbstractEntity<FiscalYear> {
  @Column({ unique: true, nullable: false, name: 'fiscal_year' })
  fiscalYear: string;

  @Column({ nullable: false, name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ nullable: false, name: 'end_date', type: 'date' })
  endDate: Date;

  @ManyToOne(() => Country, (country) => country.fiscalYear, {
    nullable: false,
  })
  @JoinColumn({ name: 'country' })
  country: Country;

  @OneToMany(() => Holidays, (holiday) => holiday.fiscalYear)
  holiday: Holidays[];

  @OneToMany(() => LeavePolicy, (leavePolicy) => leavePolicy.fiscalYear)
  leavePolicy: LeavePolicy[];
}
