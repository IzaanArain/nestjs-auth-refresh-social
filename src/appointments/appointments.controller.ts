import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/user-role.enum';
import { RolesGuard } from 'src/auth/guard/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(UserRole.Patient)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createApppointment(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Roles(UserRole.Doctor, UserRole.Patient)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAppointments(@Request() request) {
    return this.appointmentsService.getAppointments(request.user._id);
  }
}
