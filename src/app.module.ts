import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { PostModule } from './module/post/post.module';

import { DataSource } from 'typeorm';
import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './module/database/database.module';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET_KEY'),
        global: true,
      }),
      inject: [ConfigService],
    }),

    DatabaseModule,

    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

/**
 * Typeorm migraion commands
 *
 * ? create migration file
 * > typeorm migration:create ./path-to-migrations-dir/PostRefactoring
 */
