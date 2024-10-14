import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';


// This code exports Jwt configuration settings using NestJS's registerAs function.

export default registerAs(
  'jwt',
  (): JwtSignOptions => ({
    secret: process.env.JWT_SECRET,
     expiresIn: process.env.JWT_EXPIRE_IN
  }),
);
