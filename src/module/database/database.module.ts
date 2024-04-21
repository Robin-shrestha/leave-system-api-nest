import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.getOrThrow('MYSQL_HOST'),
          port: configService.getOrThrow('MYSQL_PORT'),
          username: configService.getOrThrow('MYSQL_USER'),
          password: configService.getOrThrow('MYSQL_PASSWORD'),
          database: configService.getOrThrow('MYSQL_DATABASE'),
          // entities: ['./module/**/*.entity{.ts,.js}'], // do this for manual loading of enitites
          autoLoadEntities: true,
          synchronize: configService.getOrThrow('MYSQL_SYNC'),
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
