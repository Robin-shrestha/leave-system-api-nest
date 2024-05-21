import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AuthProvider, Gender, Role } from 'src/types/enums';
import { Country } from 'src/module/country/entities/country.entity';
import { AbstractEntity } from 'src/module/database/abstract.entity';
import { UserLeave } from 'src/module/user-leave/entities/user-leave.entity';
import { LeaveRecord } from 'src/module/leave-record/entities/leave-record.entity';

@Entity()
export class Users extends AbstractEntity<Users> {
  @ApiProperty()
  @Column({ length: 120, nullable: false, unique: true })
  username: string;

  // TODO
  @Column({ length: 120, nullable: true })
  password: string; // not used currently

  @Column({
    type: 'enum',
    enum: AuthProvider,
    nullable: false,
    default: AuthProvider.GOOGLE,
  })
  provider: AuthProvider;

  @ApiProperty()
  @Column({ length: 150, nullable: false, unique: true })
  email: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
  })
  role: Role;

  @ApiProperty()
  @ManyToOne(() => Country, (country) => country.countryCode, {
    nullable: false,
  })
  @JoinColumn({
    name: 'country',
  })
  country: Country;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @ApiProperty()
  @Column({ name: 'profile_picture', nullable: true })
  profilePicture: string;

  @ApiProperty()
  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @ApiProperty()
  @Column({ nullable: true })
  address: string;

  // This can be normalized
  @ApiProperty()
  @Column({ nullable: true })
  designation: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: Users;

  @ApiProperty()
  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'manager' })
  manager?: Users;

  @OneToMany(() => UserLeave, (userLeave) => userLeave.id)
  userLeaves: UserLeave[];

  @OneToMany(() => LeaveRecord, (leaveRecord) => leaveRecord.user)
  leaveRecord: LeaveRecord[];
}
