import { IsDateString, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  // @IsString()
  // @IsNotEmpty()
  // patientId: string;

  @IsString()
  @IsNotEmpty()
  slotId: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   status: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // ISO 8601 format: "2025-06-02T09:00:00Z"
}

//  @IsMongoId() // valid mongodb id checker
