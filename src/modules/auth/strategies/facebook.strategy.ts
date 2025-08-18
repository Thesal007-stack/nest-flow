import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FB_APP_ID as string,
      clientSecret: process.env.FB_APP_SECRET as string,
      callbackURL: process.env.FB_CALLBACK_URL as string,
      profileFields: ['emails', 'name'], // good to include 'id' too
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const email = profile.emails?.[0]?.value ?? null;
    const firstName = profile.name?.givenName ?? null;
    const lastName = profile.name?.familyName ?? null;

    const user = {
      email,
      firstName,
      lastName,
    };

    const payload = { user, accessToken };
    done(null, payload);
  }
}
