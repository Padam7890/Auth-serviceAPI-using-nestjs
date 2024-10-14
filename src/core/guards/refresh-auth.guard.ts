import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


//injectable RefreshAuthGuard
@Injectable()
export class RefreshAuthGuard extends AuthGuard("refresh-jwt"){

}