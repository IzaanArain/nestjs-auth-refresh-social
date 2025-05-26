import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "src/common/interfaces/token-payload.interface";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        configService: ConfigService,
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) {
         super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.jwt,
            ]),
            secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET')
         });
    }

    async validate(payload: TokenPayload) {
        // return this.userService.getUser({_id: payload.userId });
        return this.authService.validateJwtUser(payload.userId)
    }
}