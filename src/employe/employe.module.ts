import { Module } from '@nestjs/common';
import { EmployeService } from './employe.service';
import { EmployeController } from './employe.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [EmployeController],
  providers: [
    EmployeService
  ],
  exports: [EmployeService],

})
export class EmployeModule {}
