import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, User } from '@prisma/client';
import { hashPassword } from 'src/utils/hash-password';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: DatabaseService) {}
  async create(data: userDto): Promise<User> {
    const existingUser = await this.findOne(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    data.password = await hashPassword(data.password);
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findOneById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
  async updateSecretKey(id: number, secretKey: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        twoFaSecret: secretKey,
        enable2fa: true,
      },
    });
  }
  async disable2FA(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        enable2fa: false,
        twoFaSecret: null,
      },
    });

  }
}
