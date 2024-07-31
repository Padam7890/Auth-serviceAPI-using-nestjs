import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { userDto } from 'src/user/dto/user.dto';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<{ accessToken: string } | { validate2FA: string; message: string } | {user:User}>{
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException(`User ${email} not found`);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid Password');
    }
    //if user has enabled 2fa and have the secret key than 

    if (user.enable2fa && user.twoFaSecret) {
      return {
        validate2FA: "http://localhost:3000/auth/validate-2fa",
        message:"Please send the one-time password /token from your Google Authenticator App"
        
      }
      
    }
    const token = await this.createToken(user);
    return {
      accessToken: token.access_token,
      user: user,
    };
  }
  async signUp(data: userDto): Promise<any> {
    const user = await this.userService.create(data);
    const token = await this.createToken(user);
    return {
      access_token: token.access_token,
      user: user,
    };
  }

  private async createToken(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }

  async enable2fa(id: number): Promise<any> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }
    if (user.enable2fa) {
      return {
        secret: user.twoFaSecret,
      };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFaSecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFaSecret);
    return {
      secret: user.twoFaSecret,
    };
  }
  async disable2fa(id: number): Promise<any> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }
    if (!user.enable2fa) {
      return {
        message: '2FA is already disabled',
      };
    }
    return this.userService.disable2FA(id);
  }
  async verify2fa(id: number, token: string): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new UnauthorizedException(`User not found`);
      }
      const verified = speakeasy.totp.verify({
        secret: user.twoFaSecret,
        encoding: 'base32',
        token,
      });
      if (verified) return { verified: true };
      else return { verified: false };
    } catch (error) {
      throw new UnauthorizedException('Error Verifying token');
    }
  }
}
