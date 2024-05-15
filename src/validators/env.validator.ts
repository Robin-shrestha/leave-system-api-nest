import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class EnvironmentVariables {
  @IsString({ message: 'Missing or Invalid env key: PORT' })
  PORT: string;

  @IsString({ message: 'Missing or Invalid env key: DB_PORT' })
  DB_PORT: string;

  @IsString({ message: 'Missing or Invalid env key: DB_DATABASE' })
  DB_DATABASE: string;

  @IsString({ message: 'Missing or Invalid env key: DB_USER' })
  DB_USER: string;

  @IsString({ message: 'Missing or Invalid env key: DB_PASSWORD' })
  DB_PASSWORD: string;

  @IsString({ message: 'Missing or Invalid env key: DB_HOST' })
  DB_HOST: string;

  @IsString({ message: 'Missing or Invalid env key: DB_SYNC' })
  DB_SYNC: string;

  @IsString({ message: 'Missing or Invalid env key: JWT_SECRET_KEY' })
  JWT_SECRET_KEY: string;

  @IsString({ message: 'Missing or Invalid env key: GOOGLE_CLIENT_ID' })
  GOOGLE_CLIENT_ID: string;

  @IsString({ message: 'Missing or Invalid env key: GOOGLE_CLIENT_SECRET' })
  GOOGLE_CLIENT_SECRET: string;

  @IsString({ message: 'Missing or Invalid env key: GOOGLE_CALLBACK_URL' })
  GOOGLE_CALLBACK_URL: string;
}

export const isEnvValid = (config: Record<string, unknown>) => {
  // `plainToClass` to converts plain object into Class
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  // `validateSync` method validate the class and returns errors
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};
