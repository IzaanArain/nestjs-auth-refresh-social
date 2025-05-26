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
        console.log(data)
        const userExist = (await this.userModel.findOne({ email: data.email }))?.toObject();
        if(userExist) {
            throw new ConflictException('User with this email already exists');
        }
        return await new this.userModel({
            ...data,
            password: await hash(data.password,10)
        }).save();
    }

    async getUser(query: FilterQuery<User>) {
        const user = (await this.userModel.findOne(query))?.toObject();
        if(!user) {
            throw new NotFoundException('User not found!')
        }
        return user;
    };
    
    async getUsers(query: FilterQuery<User>) {
        return this.userModel.find(query);
    }
}
