import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../../database/database.service';
import { AuthorizationCode, Prisma, Role, User } from '@prisma/client';
import { hashPassword } from '../../utils/hash-password';
import { roleEnums } from '../../core/interfaces/types';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  //service injection
  constructor(private prisma: DatabaseService) {}

  //create user service
  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    data.password = await hashPassword(data.password);
    const userRole = await this.getRoleByName(roleEnums.USER);
    if (!userRole || !userRole.id) {
      throw new BadRequestException('Role not found or role ID is missing');
    }
    const savedata = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        Role: {
          connect: {
            id: userRole.id,
          },
        },
      },
    });
    return savedata;
  }

  //get all user service
  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        Role: true,
      },
    });
  }
  //get user by email service
  async findOne(email: string) {
    if (!email) {
      throw new BadRequestException('Please provide a valid email address');
    }
    return await this.prisma.user.findUnique({ where: { email } });
  }

  //get user by email service
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  //get user by id service
  findoneByid(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        Role: true,
      },
    });
  }

  //update user service
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  //delete user service
  remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  //get role by name service
  async getRoleByName(roleName: roleEnums): Promise<Role> {
    return await this.prisma.role.findUnique({
      where: { name: roleName },
    });
  }

  //get role name by id service
  async getRoleNameByid(id: number): Promise<Role> {
    return await this.prisma.role.findUnique({
      where: { id },
    });
  }

  //reset password token service
  async resetPasswordToken(id: number): Promise<User> {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetTokenExpire: expiresAt,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Failed to generate reset token');
    }
  }
  //find user by token service
  async findByToken(hashedToken: string) {
    console.log(hashedToken);
    const getUser = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpire: {
          gt: new Date(),
        },
      },
    });
    if (!getUser) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return getUser;
  }

  //update password service
  async updatePassword(token: string, newPassword: string): Promise<User> {
    const user = await this.findByToken(token);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    const newPasswordHash = await hashPassword(newPassword);
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: newPasswordHash,
        passwordResetToken: null,
        passwordResetTokenExpire: null,
      },
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
