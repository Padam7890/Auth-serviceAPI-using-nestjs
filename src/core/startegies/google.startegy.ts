import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../../domain/auth/auth.service';

//Injectable Google OAuth Starrtgey
@Injectable()
export class GoogleStartegy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfig: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackUrl,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      if (!profile.emails || !profile.emails.length) {
        throw new Error('No email found in profile');
      }

      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: '', 
      });

      console.log('Authenticated User:', user);

      if (!user) {
        return done(new Error('User not found'), false);
      }

      done(null, user); 
    } catch (error) {
      console.error('Error in Google Strategy:', error.message); 
      done(error, false); 
    }
  }
}
