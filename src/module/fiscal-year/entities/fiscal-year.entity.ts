import { Country } from 'src/module/country/entities/country.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class FiscalYear extends AbstractEntity<FiscalYear> {
  @Column({ unique: true, nullable: false, name: 'fiscal_year' })
  fiscalYear: string;

  @Column({ nullable: false, name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ nullable: false, name: 'end_date', type: 'date' })
  endDate: Date;

  @ManyToOne(() => Country, (country) => country.countryCode, {
    nullable: false,
  })
  @JoinColumn({ name: 'country' })
  country: Country;
}
