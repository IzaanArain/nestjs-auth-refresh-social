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
  async createApppointment(
    @Body() dto: CreateAppointmentDto,
    @Request() request
  ) {
    const data = await this.appointmentsService.create({...dto, patientId: request.user._id});
    return { success:true, message:"Appointment booked successfully", data}
  }

  @Roles(UserRole.Doctor, UserRole.Patient)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAppointments(@Request() request) {
    return await this.appointmentsService.getAppointments(request.user._id);
  }
}
