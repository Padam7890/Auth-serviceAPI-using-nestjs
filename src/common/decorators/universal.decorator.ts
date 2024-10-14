import { applyDecorators, CanActivate, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Permissions } from './permissions.decorator';
import { Auth } from './auth.decorator';

interface UniversalDecoratorOptions {
  role?: string;
  permissions?: string[];
  summary?: string;
  responseType?: any;
  body?: any;
  includeBearerAuth?: boolean;
  guards?: any;
}


export function UniversalDecorator({
  role,
  permissions,
  summary,
  responseType,
  body,
  guards = [],
}: UniversalDecoratorOptions) {
  const decorators = [];

  if (body) {
    decorators.push(
      ApiBody({
        schema: {
          type: 'object',
          properties: body,
        },
      }),
    );
  }


  if (role) {
    decorators.push(Auth(role));
  }

  if (permissions) {
    decorators.push(Permissions(...permissions));
  }

  if (guards.length > 0) {
    decorators.push(UseGuards(...guards));
  }
  if (summary) {
    decorators.push(
      ApiOperation({ summary }),
    );
  }
  if (responseType) {
    decorators.push(
      ApiResponse({ type: responseType }),
    );
  }

  return applyDecorators(...decorators);
}
