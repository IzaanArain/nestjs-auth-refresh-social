import { IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator";
import { UserRole } from "../enum/user-role.enum";

export class CreateUserDto {
    @IsEmail()
    email:string;

    @IsStrongPassword()
    password: string;

    @IsString()
    name: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsString()
    specialization: string;
}