import { AbstractEntity } from 'src/module/database/abstract.entity';
import { LeavePolicy } from 'src/module/leave-policy/entities/leave-policy.entity';
import { Users } from 'src/module/user/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique('user_leave_policy', ['user', 'leavePolicy'])
export class UserLeave extends AbstractEntity<UserLeave> {
  @Column({ nullable: true, name: 'additional_days' })
  additionalDays?: number;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => LeavePolicy, (leavePolicy) => leavePolicy.id)
  @JoinColumn({ name: 'leave_policy_id' })
  leavePolicy: LeavePolicy;
}
