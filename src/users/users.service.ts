import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async createUser(data: CreateUserDto) {
        const userExist = await this.getUser({email: data.email})
        if(userExist) throw new ConflictException('User with this email already exists');
        return await new this.userModel({
            ...data,
            password: await hash(data.password,10)
        }).save();
    }

    async getUser(query: FilterQuery<User>) {
        const user = (await this.userModel.findOne(query))?.toObject();
        if(!user) {
            throw new NotFoundException('User not found')
        }
        return user;
    };
    
    async getUsers() {
        return this.userModel.find({});
    }
}
