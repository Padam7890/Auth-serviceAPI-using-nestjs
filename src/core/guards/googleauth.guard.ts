
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//Google Authentication 
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}