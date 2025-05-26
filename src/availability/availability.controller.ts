import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityWithSlotsDto } from './dto/create-availability.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';


@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) { }

  @Roles(UserRole.Doctor)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() schedule: CreateAvailabilityWithSlotsDto[],
    @Request() request
  ) {
    const data = this.availabilityService.createAvailabilityWithSlots(request.user._id,schedule);
    return { success: true, message: 'Schedule updated successfully', data };
  }


  @Roles(UserRole.Doctor)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAvailabilityDaySlots(
    @Request() request
  ) {
    return await this.availabilityService.getAvailabilityWithSlots(request.user._id)
  }

}
