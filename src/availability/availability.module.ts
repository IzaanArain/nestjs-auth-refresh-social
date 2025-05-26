import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Availability, AvailabilitySchema } from './schema/availability.schema';
import { TimeSlot, TimeSlotSchema } from './schema/timeSlots.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        {
          name: Availability.name,
          schema: AvailabilitySchema
        },
        {
          name: TimeSlot.name,
          schema: TimeSlotSchema
        },
      ])
    ],
  providers: [AvailabilityService],
  controllers: [AvailabilityController],
  exports: [AvailabilityService]
})
export class AvailabilityModule {}
