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
  ) { }

  async createAvailabilityWithSlots(
    doctorId: string,
    schedule: CreateAvailabilityWithSlotsDto[],
  ) {
    if (schedule.length === 0) {
      throw new ForbiddenException('Pleas provide a valid schedule');
    }
    await this.TimeSlotModel.deleteMany({ doctor: doctorId});
    await this.AvailabilityModel.deleteMany({doctor: doctorId});
    return await Promise.all(
      schedule.map(async ({ day, slots }) => {

        const createdSlots = await this.TimeSlotModel.insertMany(
          slots.map(({ from, to }) => {
            return {
              from,
              to,
              doctor: doctorId,
            };
          }),
        );

        const slotIds = createdSlots.map((slot) => slot._id);

        return this.AvailabilityModel.findOneAndUpdate(
          { doctor: doctorId, day },
          { slots: slotIds },
          { new: true, upsert: true },
        );
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
          let: { slot_ids: '$slots' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$slot_ids'],
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
