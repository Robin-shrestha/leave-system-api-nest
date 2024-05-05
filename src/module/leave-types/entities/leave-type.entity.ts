import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from 'src/module/database/abstract.entity';
import { LeavePolicy } from 'src/module/leave-policy/entities/leave-policy.entity';
import { Gender } from 'src/module/user/entities/users.entity';

@Entity()
export class LeaveType extends AbstractEntity<LeaveType> {
  @Column({ nullable: false, unique: true })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, type: 'enum', enumName: 'Gender' })
  affectedGender?: Gender;

  @OneToMany(() => LeavePolicy, (leavePolicy) => leavePolicy.leaveType)
  leavePolicy: LeavePolicy[];
  //  other constraints can be added  as required
}
