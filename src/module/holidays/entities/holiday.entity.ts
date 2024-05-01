import { FiscalYear } from 'src/module/fiscal-year/entities/fiscal-year.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Holidays extends AbstractEntity<Holidays> {
  @Column({ nullable: false })
  name: string;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @ManyToOne(() => FiscalYear, (fiscalYear) => fiscalYear.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'fiscal_year' })
  fiscalYear: FiscalYear;
}
