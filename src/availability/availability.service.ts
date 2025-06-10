import { ForbiddenException, Injectable } from '@nestjs/common';
import { Availability } from './schema/availability.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, Types } from 'mongoose';
import { TimeSlot } from './schema/timeSlots.schema';
import { CreateAvailabilityWithSlotsDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    private readonly AvailabilityModel: Model<Availability>,
    @InjectModel(TimeSlot.name)
    private readonly TimeSlotModel: Model<TimeSlot>,
  ) {}

  async createAvailabilityWithSlots(
    doctorId: string,
    schedule: CreateAvailabilityWithSlotsDto[],
  ) {
    if (!schedule.length) {
      return [];
    }
    return await Promise.all(
      schedule.map(async ({ day, slots }) => {
        await this.AvailabilityModel.deleteMany({ doctor: doctorId, day });

        const availability = await this.AvailabilityModel.create({
          day,
          doctor: doctorId,
        });

        await this.TimeSlotModel.insertMany(
          slots.map(({ from, to }) => {
            return {
              from,
              to,
              availability: availability._id,
              doctor: doctorId,
            };
          }),
        );
        
        return availability;
      }),
    );
  }

  async getAvailabilityWithSlots(doctorId: string) {
    const availabilityTimeSlots = await this.AvailabilityModel.aggregate([
      {
        $match: {
          doctor: new Types.ObjectId(doctorId),
        },
      },
      {
        $lookup: {
          from: 'timeslots',
          let: { avail_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$availability', '$$avail_id'],
                },
              },
            },
            {
              $project: {
                from: 1,
                to: 1,
              },
            },
          ],
          as: 'slots',
        },
      },
    ]);
    return availabilityTimeSlots;
  }
}
