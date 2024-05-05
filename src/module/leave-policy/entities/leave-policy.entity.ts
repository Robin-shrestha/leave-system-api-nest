import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { FiscalYear } from 'src/module/fiscal-year/entities/fiscal-year.entity';
import { LeaveType } from 'src/module/leave-types/entities/leave-type.entity';

@Entity()
@Unique('leave_year', ['fiscalYear', 'leaveType'])
export class LeavePolicy extends AbstractEntity<LeavePolicy> {
  @ManyToOne(() => FiscalYear, (fiscalYear) => fiscalYear.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'fiscal_year' })
  fiscalYear: FiscalYear; // kun year ra country ko ho

  @ManyToOne(() => LeaveType, (leaveType) => leaveType.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'leave_type' })
  leaveType: LeaveType;

  @Column({
    default: 0,
    nullable: false,
    type: 'tinyint',
    name: 'max_transferable',
  })
  maxTransferable: number; // if 0 not transferrable

  @Column({ default: false })
  cashable: boolean;

  @Column({ type: 'tinyint' })
  count: number;
}
