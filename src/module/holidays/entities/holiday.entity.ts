import { FiscalYear } from 'src/module/fiscal-year/entities/fiscal-year.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique('unique_fiscal_year_holiday', ['date', 'fiscalYear'])
export class Holidays extends AbstractEntity<Holidays> {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => FiscalYear, (fiscalYear) => fiscalYear.holiday, {
    nullable: false,
  })
  @JoinColumn({ name: 'fiscal_year_id' })
  fiscalYear: FiscalYear;
}
