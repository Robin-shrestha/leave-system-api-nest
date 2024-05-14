import { AbstractEntity } from 'src/module/database/abstract.entity';
import { LeavePolicy } from 'src/module/leave-policy/entities/leave-policy.entity';
import { LeaveRecord } from 'src/module/leave-record/entities/leave-record.entity';
import { Users } from 'src/module/user/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity()
@Unique('user_leave_policy', ['user', 'leavePolicy'])
export class UserLeave extends AbstractEntity<UserLeave> {
  @Column({ default: 0, name: 'additional_days' })
  additionalDays?: number;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => LeavePolicy, (leavePolicy) => leavePolicy.userLeaves)
  @JoinColumn({ name: 'leave_policy_id' })
  leavePolicy: LeavePolicy;

  @OneToMany(() => LeaveRecord, (leaveRecord) => leaveRecord.userLeave)
  leaveRecords: LeaveRecord[];
}
