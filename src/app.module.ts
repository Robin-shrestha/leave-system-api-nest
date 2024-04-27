import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_FILTER } from '@nestjs/core';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { PostModule } from './module/post/post.module';
import { AuthModule } from './module/auth/auth.module';
import { RolesModule } from './module/roles/roles.module';
import { CountryModule } from './module/country/country.module';
import { DatabaseModule } from './module/database/database.module';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { DefaultExceptionFilter } from './exception-filters/default-exception.filter';
import { DatabaseExceptionFilter } from './exception-filters/database-excpetion.filter';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,

    AuthModule,
    UserModule,
    PostModule,
    RolesModule,
    CountryModule,
  ],
  controllers: [],
  providers: [
    AppService,
    // ? default exception filter goes first
    {
      provide: APP_FILTER,
      useClass: DefaultExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

/**
 * Typeorm migraion commands
 *
 * ? create migration file
 * > typeorm migration:create ./path-to-migrations-dir/PostRefactoring
 */
