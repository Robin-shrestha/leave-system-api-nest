import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';

import { UserModule } from './module/user/user.module';
// import { PostModule } from './module/post/post.module';

import { AppService } from './app.service';
import { JwtModule } from './module/jwt/jwt.module';
import { AuthModule } from './module/auth/auth.module';
import { SeedModule } from './module/seed/seed.module';
import { ConfigModule } from './module/config/config.module';
import { CountryModule } from './module/country/country.module';
import { DatabaseModule } from './module/database/database.module';
import { HolidaysModule } from './module/holidays/holidays.module';
import { UserLeaveModule } from './module/user-leave/user-leave.module';
import { FiscalYearModule } from './module/fiscal-year/fiscal-year.module';
import { LeaveTypesModule } from './module/leave-types/leave-types.module';
import { LeavePolicyModule } from './module/leave-policy/leave-policy.module';
import { LeaveRecordModule } from './module/leave-record/leave-record.module';

export const appDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['./module/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  logging: false, //TODO update later,
  migrationsRun: false,
  migrationsTableName: 'migration_table',
});
@Module({
  imports: [
    JwtModule,
    ConfigModule,
    DatabaseModule,

    AuthModule,
    UserModule,
    CountryModule,
    FiscalYearModule,
    HolidaysModule,
    LeavePolicyModule,
    LeaveTypesModule,
    UserLeaveModule,
    LeaveRecordModule,
    SeedModule,

    // PostModule, // ?TEST MODULE
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
