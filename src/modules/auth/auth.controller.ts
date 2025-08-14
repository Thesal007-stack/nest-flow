import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IPayloadJwt } from './auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt.guard';
import { IRequestWithUser } from '@common/global-interfaces/http.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
@SerializeOptions({
  strategy: 'excludeAll',
})
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  public async register(@Body() registerDto: RegisterUserDto) {
    const user = await this.authService.register(registerDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (!user) {
      throw new NotFoundException(`User ${user} can register `);
    }
    const { password, ...rest } = user;
    return rest;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@Req() req: IRequestWithUser, @Res() res: Response) {
    const { user } = req;
    if (!user?.id || !user?.email) {
      throw new Error(`Both user id and email not found`);
    }
    const payload: IPayloadJwt = {
      userId: user.id,
      email: user.email,
    };
    const cookie = this.authService.getCookieWithToken(payload);
    res.setHeader('Set-Cookie', cookie);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return res.send(rest);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public getAuthenticatedUser(@Req() req: IRequestWithUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.clearCookie());
    return res.sendStatus(200);
  }
}
