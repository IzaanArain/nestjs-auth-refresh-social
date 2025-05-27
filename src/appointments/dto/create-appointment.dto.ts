import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  //   @IsMongoId()
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  //   @IsMongoId()
  // @IsString()
  // @IsNotEmpty()
  // patientId: string;

  //   @IsMongoId()
  @IsString()
  @IsNotEmpty()
  slotId: string;

//   @IsString()
//   @IsNotEmpty()
//   status: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
