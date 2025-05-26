import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointments } from './schema/appointments.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { isNull } from 'util';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointments.name)
        private readonly AppointmentsModel: Model<Appointments>,
        private readonly userService: UsersService
    ) { };

    async create({ doctorId, patientId, reason, slotId }: { doctorId: string; patientId: string; reason: string; slotId: string }) {
        return new this.AppointmentsModel({
            doctor: doctorId,
            patient: patientId,
            reason,
            slot: slotId,
            status: "pending"
        }).save()
    }

    async getAppointments(userId: string) {
        const user = await this.userService.getUser({ _id: userId });
        const userObjectId = new Types.ObjectId(user._id);
        return this.AppointmentsModel.aggregate([
            {
                $match: {
                    ...(user.role === 'doctor' && { doctor: userObjectId } ),
                    ...(user.role === 'patient' && { patient: userObjectId } ),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { user_id: `$doctor` },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ],
                    as: `doctor`
                }
            },
             {
                $lookup: {
                    from: 'users',
                    let: { user_id: `$patient` },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$user_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ],
                    as: `patient`
                }
            },
            {
                $unwind: {
                    preserveNullAndEmptyArrays: true,
                    path: `$doctor`
                }
            },
            {
                $unwind: {
                    preserveNullAndEmptyArrays: true,
                    path: `$patient`
                }
            },
        ]);
    }

}