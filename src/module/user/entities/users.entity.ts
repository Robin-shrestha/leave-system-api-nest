import { Country } from 'src/module/country/entities/country.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { LeaveRecord } from 'src/module/leave-record/entities/leave-record.entity';
import { Roles } from 'src/module/roles/entity/roles.entity';
import { UserLeave } from 'src/module/user-leave/entities/user-leave.entity';
import { Gender } from 'src/types/enums';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Users extends AbstractEntity<Users> {
  @Column({ length: 120, nullable: false })
  username: string;

  @Column({ length: 150, nullable: false, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture: string;

  @Column({ type: 'date', nullable: false, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column()
  address: string;

  // This can be normalized
  @Column()
  designation: string;

  @Column()
  phone: string;

  @ManyToMany(() => Roles, (role) => role.id, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Roles[];

  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: Users;

  @ManyToOne(() => Country, (country) => country.countryCode, {
    nullable: false,
  })
  @JoinColumn({
    name: 'country',
  })
  country: Country;

  @OneToMany(() => UserLeave, (userLeave) => userLeave.id)
  userLeaves: UserLeave[];

  @OneToMany(() => LeaveRecord, (leaveRecord) => leaveRecord.user)
  leaveRecord: LeaveRecord[];
}
