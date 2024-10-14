import {
  Body,
  Get,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Res,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import {
  ExchangeCode,
  forgetPasswordDTO,
  resetPasswordDTO,
  signInDTO,
  ValidateTokenDTO,
} from './dto/auth';
import { UniversalDecorator } from '../../common/decorators/universal.decorator';
import { RefreshAuthGuard } from '../../core/guards/refresh-auth.guard';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { createResponse } from '../../helper/response.helper';
import { GoogleAuthGuard } from 'src/core/guards/googleauth.guard';
import { BlockToManyRequest } from 'src/core/guards/customTGuard.guard';
import { Response } from 'express';
import { createResponseType } from 'src/core/interfaces/types';

// Controller For Authentication Module
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //signin http method
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @UseGuards(BlockToManyRequest)
  @UniversalDecorator({
    summary: 'Sign in Form',
    responseType: signInDTO,
    body: {
      email: {
        type: 'string',
        example: 'padam@gmail.com',
      },
      password: {
        type: 'string',
        example: '12345678',
      },
    },
  })
  async signin(@Req() req) {
    return this.authService.login(req.user);
  }

  //signup http method
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @UniversalDecorator({
    summary: 'Register New User',
    responseType: CreateUserDto,
  })
  async signUp(@Body() user: CreateUserDto): Promise<any> {
    return this.authService.signUp(user);
  }

  @UniversalDecorator({
    summary: 'Register New User',
    responseType: CreateUserDto,
    includeBearerAuth: true,
  })
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request): Promise<createResponseType> {
    const response = await this.authService.createRefreshToken(request.user.id);
    return createResponse(HttpStatus.OK, 'Refresh Token', response);
  }

  //google login http method
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  //google callback http method
  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.login(req.user);
    const generateCode = await this.authService.generateCode(response);
    res.redirect(`${process.env.FRONTEND_URL}?code=${generateCode.code}`);
  }

  @Post('exchange-code')
  @UniversalDecorator({
    summary: 'Exchange code to Token',
    responseType: ExchangeCode,
  })
  async exchangeCode(@Body() code: ExchangeCode): Promise<createResponseType> {
    const token = await this.authService.exchangeCodeWithToken(code.code);
    return createResponse(HttpStatus.OK, 'User Fetched Successfully', token);
  }

  //forget password http method
  @Post('forget-password')
  @UniversalDecorator({
    summary: 'Forget Password',
    responseType: forgetPasswordDTO,
  })
  async forgetPassword(@Body() forgetPasswordDTO: forgetPasswordDTO): Promise<createResponseType> {
    const response = await this.authService.forgetPassword(
      forgetPasswordDTO.email,
    );
    return createResponse(HttpStatus.OK, response.message);
  }

  //reset password http method
  @Post('reset-password')
  @UniversalDecorator({
    summary: 'Reset Password',
    responseType: resetPasswordDTO,
  })
  async resetPassword(@Body() resetPasswordDTO: resetPasswordDTO): Promise<createResponseType> {
    const response = await this.authService.resetPassword(resetPasswordDTO);
    return createResponse(
      HttpStatus.OK,
      'Password reset successfully',
      response,
    );
  }

  @Post('enable-2fa')
  @UniversalDecorator({
    summary: '2Factor Authentication',
    responseType: '',
    role: process.env.ACCESS_ROLE,
  })
  @UseGuards(BlockToManyRequest)
  async enable2fa(@Request() req):Promise<createResponseType> {
    const twofaenabled = await this.authService.enable2fa(req.user.id);
    return createResponse(
      HttpStatus.OK,
      'Enable 2FA successfully With Secert Key , Dont share with others',
      twofaenabled,
    );
  }

  @Post('disable-2fa')
  @UniversalDecorator({
    summary: 'Disable 2Factor Authentication',
    responseType: '',
    role: process.env.ACCESS_ROLE,
  })
  async disable2fa(@Request() req): Promise<createResponseType> {
    const disable2fa = await this.authService.disable2fa(req.user.id);
    return createResponse(
      HttpStatus.OK,
      'Disable 2FA successfully',
      disable2fa,
    );
  }

  @Post('verify-2fa')
  @UniversalDecorator({
    summary: 'Verify 2Factor Authentication',
    responseType: '',
    role: process.env.ACCESS_ROLE,
  })
  @UseGuards(BlockToManyRequest)
  async verify2fa(
    @Request() req,
    @Body() ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.verify2fa(req.user.id, ValidateTokenDTO.token);
  }
}
