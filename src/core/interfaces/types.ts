//types
import { HttpStatus } from '@nestjs/common';
import { AuthorizationCode, User } from '@prisma/client';

export enum roleEnums {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface token {
  token: string;
}

export type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
};

export interface IUserResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    passwordChangedAt: Date | null;
    passwordResetToken: string | null;
    passwordResetTokenExpire: Date | null;
    roleId: number;
  };
}

export interface AuthorizationCodeWithUser extends AuthorizationCode {
  user: User;
}

export interface createResponseType {
  statusCode: HttpStatus;
  message?: string;
  data?: any;
}
