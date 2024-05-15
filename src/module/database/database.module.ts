import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from 'src/validators/env.validator';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return {
          type: 'mysql',
          host: configService.getOrThrow('DB_HOST'),
          port: configService.getOrThrow('DB_PORT'),
          username: configService.getOrThrow('DB_USER'),
          password: configService.getOrThrow('DB_PASSWORD'),
          database: configService.getOrThrow('DB_DATABASE'),
          // entities: ['./module/**/*.entity{.ts,.js}'], // do this for manual loading of enitites
          autoLoadEntities: true,
          retryAttempts: 3,
          synchronize: configService.getOrThrow('DB_SYNC'),
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
