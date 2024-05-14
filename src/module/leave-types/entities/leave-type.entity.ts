import { Column, Entity, OneToMany } from 'typeorm';

import { Gender } from 'src/types/enums';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { LeavePolicy } from 'src/module/leave-policy/entities/leave-policy.entity';

@Entity()
export class LeaveType extends AbstractEntity<LeaveType> {
  @Column({ nullable: false, unique: true })
  type: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: Gender,
  })
  affectedGender?: Gender;

  @OneToMany(() => LeavePolicy, (leavePolicy) => leavePolicy.leaveType)
  leavePolicy: LeavePolicy[];
  //  other constraints can be added  as required
}
