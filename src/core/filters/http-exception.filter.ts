import {  
  Catch,  
  ArgumentsHost,  
  HttpException,  
  HttpStatus,  
  ExceptionFilter,  
} from '@nestjs/common';  
import { Request, Response } from 'express';  
import {  
  PrismaClientValidationError,  
  PrismaClientKnownRequestError,  
} from '@prisma/client/runtime/library';  
import { MyResponseObj } from '../interfaces/types';

@Catch()  
export class AllExceptionsFilter implements ExceptionFilter {  
  catch(exception: unknown, host: ArgumentsHost) {  
    const ctx = host.switchToHttp();  
    const response = ctx.getResponse<Response>();  
    const request = ctx.getRequest<Request>();  

    const myResponseObj: MyResponseObj = {  
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,  
      timestamp: new Date().toISOString(),  
      path: request.url,  
      message: 'Internal Server Error',  
    };  

    if (exception instanceof HttpException) {  
      const status = exception.getStatus();  
      const res = exception.getResponse();  

      myResponseObj.statusCode = status;  
      myResponseObj.message =  
        typeof res === 'object' && 'message' in res  
          ? Array.isArray(res['message'])  
            ? res['message'][0] // Handle array messages  
            : res['message']  
          : res;  
    } else if (exception instanceof PrismaClientValidationError) {  
      myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;  
      myResponseObj.message = exception.message.replace(/\n/g, ' ');  
    } else if (exception instanceof PrismaClientKnownRequestError) {  
      myResponseObj.statusCode = HttpStatus.BAD_REQUEST;  
      myResponseObj.message = exception.message.replace(/\n/g, ' ');  
    } else if (exception instanceof TypeError) {  
      myResponseObj.statusCode = HttpStatus.BAD_REQUEST;  
      myResponseObj.message = 'Bad Request: Invalid input data.';  
    } else {  
      // Default fallback for unknown errors  
      console.error('Unhandled exception:', exception);  
      myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;  
      myResponseObj.message =  
        exception instanceof Error ? exception.message : 'Unexpected error occurred';  
    }  

    if (response && typeof response.status === 'function') {  
      response.status(myResponseObj.statusCode).json(myResponseObj);  
    } else {  
      console.error('Response object is undefined or malformed:', response);  
      console.error('Exception:', exception);  
    }  
  }  
}
