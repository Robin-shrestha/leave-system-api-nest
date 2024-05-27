import { AbstractEntity } from 'src/module/database/abstract.entity';
import { UserLeave } from 'src/module/user-leave/entities/user-leave.entity';
import { Users } from 'src/module/user/entities/users.entity';
import { calculateDaysInRange } from 'src/utils';
import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
@Unique('unique_leaves', ['startDate', 'endDate', 'userLeave'])
@Check(`"endDate" > startDate`) // this is not available in mysql apparently. aw sucks!
export class LeaveRecord extends AbstractEntity<LeaveRecord> {
  @Column({ nullable: false, type: 'tinyint' })
  count: number;

  @Column({ type: 'date', name: 'start_date', nullable: false })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date', nullable: false })
  endDate: Date;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: LeaveStatus,
    nullable: false,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Column({ default: null, nullable: true, name: 'reject_reason' })
  rejectReason: string;

  @ManyToOne(() => UserLeave, (userLeave) => userLeave.leaveRecords, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_leave_policy' })
  userLeave: UserLeave;

  @ManyToOne(() => Users, (user) => user.leaveRecord, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @BeforeInsert()
  @BeforeUpdate()
  updateCount() {
    this.count = calculateDaysInRange(this.startDate, this.endDate);
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateDate() {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    if (endDate < startDate) {
      throw new TypeError('start Date must be before end date');
    }
  }
}
