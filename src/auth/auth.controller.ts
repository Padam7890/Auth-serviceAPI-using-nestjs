import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { userDto } from 'src/user/dto/user.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    type: CreateUserDto,
  })
  async signIn(@Body() user: CreateUserDto): Promise<any> {
    return this.authService.signIn(user.email, user.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    type: userDto,
  })
  async signUp(@Body() user: userDto): Promise<any> {
    return this.authService.signUp(user);
  }

  @UseGuards(AuthGuard)
  @Post('enable-2fa')
  @ApiOperation({
    summary: 'Enable 2FA',
  })
  @ApiBearerAuth("JWT-auth")

  @ApiResponse({
   status: 200,
   description: 'Two-factor authentication has been Enabled successfully.',
 })
  async enable2fa(@Request() req): Promise<any> {
    return this.authService.enable2fa(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: 'Disable 2FA',
  })
  @ApiResponse({
   status: 200,
   description: 'Two-factor authentication has been disabled successfully.',
 })
 
  @Post('disable-2fa')
  async disable2fa(@Request() req): Promise<any> {
    return this.authService.disable2fa(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('verify-2fa')
  @ApiOperation({ summary: 'Verify 2FA token' })
  @ApiResponse({
    type: ValidateTokenDTO,
  })
  async verify2fa(
    @Request() req,
    @Body() ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.verify2fa(req.user.sub, ValidateTokenDTO.token);
  }
}
