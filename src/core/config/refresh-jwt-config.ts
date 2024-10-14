import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

// This code exports refresh jwt configuration settings using NestJS's registerAs function.

export default registerAs(
  'refresh_jwt',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET || 'default-refresh-secret',  
    expiresIn: process.env.REFRESH_JWT_EXPIRE_IN || '7d',               
  }),
);
