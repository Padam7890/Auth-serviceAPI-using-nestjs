import {
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import refreshJwtConfig from '../../core/config/refresh-jwt-config';
import jwtConfig from '../../core/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { MailService } from '../../common/service/mail/mail.service';
import path, { join } from 'path';
import ejs, { renderFile } from 'ejs';
import { resetPasswordDTO } from './dto/auth';
import { IUserResponse } from '../../core/interfaces/types';
import { v4 as uuidv4 } from 'uuid';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private googleAuthService: GoogleAuthService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(jwtConfig.KEY)
    private accessTokenConfig: ConfigType<typeof jwtConfig>,
    private mailService: MailService,
  ) {}

  // Signup Service
  async signUp(data: CreateUserDto): Promise<any> {
    const user = await this.userService.create(data);
    const { access_token, refresh_token } = await this.createTokens(user);

    return {
      message: 'User SignUp Successfully',
      access_token,
      refresh_token,
      user,
    };
  }

  // Validate user
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  // Login Service
  async login(user: User): Promise<any> {
    const { access_token, refresh_token } = await this.createTokens(user);
    return {
      message: 'User SignIn Successfully',
      access_token,
      refresh_token,
      user,
    };
  }

  // Generate both tokens: access and refresh
  private async createTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);
    return { access_token, refresh_token };
  }

  // Create only access token
  private async createAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return this.jwtService.signAsync(payload, this.accessTokenConfig);
  }

  // Create only refresh token
  async createRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return this.jwtService.signAsync(payload, this.refreshTokenConfig);
  }

  // Google user validation
  async validateGoogleUser(googleUser: CreateUserDto): Promise<User> {
    if (!googleUser.email) throw new Error('Please provide a valid email');
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  // Forget password service
  async forgetPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found!');
    const resetToken = await this.userService.resetPasswordToken(user.id);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken.passwordResetToken}`;
    const html = await ejs.renderFile(
      path.join(__dirname, '..', '..', 'views', 'forget-password.ejs'),
      { getUserName: user.name, resetUrl },
    );

    try {
      const { success } = await this.mailService.sendEmail(
        user.email,
        'Reset Password',
        html,
      );
      return {
        message: success
          ? 'Reset password email sent successfully.'
          : 'Failed to send reset password email.',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        message: 'An error occurred while sending the reset password email.',
      };
    }
  }

  // Reset password service
  async resetPassword(resetPasswordDTO: resetPasswordDTO): Promise<User> {
    return this.userService.updatePassword(
      resetPasswordDTO.token,
      resetPasswordDTO.password,
    );
  }

  // Generate unique code
  async generateCode(response: IUserResponse) {
    const generateUuid = uuidv4();
    const addUserToUuid = generateUuid + response.user.id;
    return this.googleAuthService.saveCode(response.user.id, addUserToUuid);
  }

  // Exchange authorization code for tokens
  async exchangeCodeWithToken(
    code: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const authorizationCode = await this.googleAuthService.findOneByCode(code);

    if (
      !authorizationCode.code ||
      authorizationCode.expiresAt < new Date() ||
      authorizationCode.used
    ) {
      throw new UnauthorizedException('Auth Code expired or invalid');
    }
    const { access_token, refresh_token } = await this.createTokens(
      authorizationCode.user,
    );
    await this.googleAuthService.updateAuthCode(authorizationCode.code);
    return { access_token, refresh_token };
  }
}
