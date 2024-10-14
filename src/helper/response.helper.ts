import { HttpStatus } from "@nestjs/common";

// response helper function to create a response object

export const createResponse = (
    statusCode:HttpStatus,
    message?:string,
    data: any = null
)=> {
    return {
        statusCode,
        message,
        ...(data && { data})
    };
  
}