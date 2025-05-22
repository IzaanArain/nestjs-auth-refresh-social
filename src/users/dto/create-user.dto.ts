import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { UserRole } from "../enum/user-role.enum";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required field' })
    email:string;

    @IsStrongPassword()
    @IsNotEmpty({ message: 'Password is required field' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Name is required field' })
    name: string;

    @IsEnum(UserRole, { message: 'Role must be one of: doctor, patient' })
    @IsNotEmpty({ message: 'Role is required field' })
    role: UserRole;

    @IsOptional()
    specialization: string;
}