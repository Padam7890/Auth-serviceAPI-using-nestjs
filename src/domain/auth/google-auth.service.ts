import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthorizationCode } from '@prisma/client';
import { AuthorizationCodeWithUser } from 'src/core/interfaces/types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly prisma: DatabaseService) {}

  private static CODE_EXPIRY_MINUTES = 10;

  async saveCode(userId: number, code: string): Promise<AuthorizationCode> {
    const expiresAt = this.calculateExpiry(
      GoogleAuthService.CODE_EXPIRY_MINUTES,
    );

    return this.prisma.authorizationCode.create({
      data: { code, userId, expiresAt },
    });
  }

  async findOneByCode(code: string): Promise<AuthorizationCodeWithUser> {
    const authCode = await this.prisma.authorizationCode.findUnique({
      where: { code },
      include: { user: true },
    });

    if (!authCode) {
      throw new BadRequestException('Authorization code not found');
    }
    return authCode;
  }

  async updateAuthCode(code: string): Promise<AuthorizationCode> {
    const authCode = await this.findOneByCode(code);
    return this.prisma.authorizationCode.update({
      where: { code },
      data: { used: true },
    });
  }

  async findOneById(id: number): Promise<AuthorizationCodeWithUser> {
    if (!id) {
      throw new BadRequestException('Missing authorization code ID');
    }

    const authCode = await this.prisma.authorizationCode.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!authCode) {
      throw new BadRequestException('Authorization code not found');
    }
    return authCode;
  }

  async deleteAuthCode(code: string): Promise<AuthorizationCode> {
    await this.findOneByCode(code);
    return this.prisma.authorizationCode.delete({ where: { code } });
  }

  private calculateExpiry(minutes: number): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
  }
}
