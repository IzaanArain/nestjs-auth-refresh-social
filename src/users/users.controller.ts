import { Body, Controller, Get, Param, Post, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './schema/user.schema';
import { UserRole } from './enum/user-role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';

// @Roles(UserRole.Patient) // has lowerer priority 
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Post()
    async createUser(@Body() request: CreateUserDto) {
        return await this.usersService.createUser(request)
    }

    // @SetMetadata('roles', [UserRole.Patient])
    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.Patient) // ? custom decorator for role checking // ? you can pass multiple enum roles as we are spreading them in the decorator
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUsers (
        @Query() user: User
    ) {
        return await this.usersService.getUsers(user);
    }

    @Roles(UserRole.Patient) 
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get('doctor/:id')
    async getDoctors (
        @Param('id') id: string
    ) {
        console.log(id)
        return await this.usersService.getDoctorInfo(id);
    }
}
