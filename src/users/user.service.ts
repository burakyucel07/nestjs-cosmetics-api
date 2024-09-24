import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({});

    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon.hash(createUserDto.password);

    createUserDto.password = hashedPassword;

    const createdUser = await this.prisma.user.create({ data: createUserDto });

    delete createdUser.password;

    return createdUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (updateUserDto.password) {
      const hashedPassword = await argon.hash(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });

    delete updatedUser.password;

    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const deletedUser = await this.prisma.user.delete({ where: { id } });

    delete deletedUser.password;

    return deletedUser;
  }

  async changeActivity(id: number, changeActivityDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isActive: changeActivityDto.isActive,
      },
    });

    delete updatedUser.password;

    return updatedUser;
  }
}
