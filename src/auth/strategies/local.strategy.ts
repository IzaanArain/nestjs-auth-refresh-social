import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        // super()
        super({
            usernameField: 'email',
        });
    };

    async validate(email: string, password: string) {
        return this.authService.verifyUser(email, password)
    }; // anything returned from any strategy validate function will be added to the current request object as user request.user
}