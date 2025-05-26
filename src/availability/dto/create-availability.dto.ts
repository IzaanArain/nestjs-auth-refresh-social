import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SlotTimeDto {
  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}

export class CreateAvailabilityWithSlotsDto {
  // @IsString()
  // @IsNotEmpty()
  // doctorId: string;

  @IsString()
  @IsNotEmpty()
  day: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotTimeDto)
  slots: SlotTimeDto[];
}
