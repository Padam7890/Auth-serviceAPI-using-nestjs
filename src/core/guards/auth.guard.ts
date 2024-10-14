import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


//Jwt Authentication G
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt"){
    

}