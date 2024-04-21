import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'public-routes';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
