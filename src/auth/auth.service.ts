import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { TokenPayload } from 'src/common/interfaces/token-payload.interface';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: User, response: Response) {
    // cookie expiration time in ms
    // const expiresAccessToken = new Date();
    // expiresAccessToken.setMilliseconds(
    //   expiresAccessToken.getTime() +
    //     parseInt(
    //       this.configService.getOrThrow<string>(
    //         'JWT_ACCESS_TOKEN_EXPIRATION_MS',
    //       ),
    //     ),
    // );

    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };
    // const jwtExpiry = `${this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`
    // jwt token expiration time in ms
    const accesToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '7d', // jwtExpiry
    });

    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    response.cookie('jwt', accesToken, {
      // domain: 'yourfrontend.com', // You Cannot Force a Cookie for a Different Domain
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production', // false for dev & true for HTTPS prod
      sameSite: 'lax', // 'none' for cross orgin production meaning if client and server orgins differ // 'lax' for dev & proxing frontend to the backend on prod
      expires: oneWeekFromNow, // expiresAccessToken
    });

    const userData = await this.userService.getUser({
      _id: user._id.toHexString(),
    });

    return { ...userData, password: undefined };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const authenticated = await compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.getUser({ _id: userId });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async logout(response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });
  }
}
