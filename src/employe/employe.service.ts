import { Injectable } from '@nestjs/common';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { Employee, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EmployeService {
  constructor(private readonly prisma: DatabaseService) {}

   async create(createEmployeDto: CreateEmployeDto):Promise<Employee> {
    const newEmploye = await this.prisma.employee.create({
      data: createEmployeDto,
    });
    return newEmploye;
  }

  async findAll():Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  async findOne(id: number):Promise<Employee> {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

 async  update(id: number, updateEmployeDto: UpdateEmployeDto): Promise<Employee> {
  const updatedEmploye = await this.prisma.employee.update({
      where: { id },
      data: updateEmployeDto,
    });
    return updatedEmploye;
  }

  async remove(id: number):Promise<Employee> {
    const deletedEmploye = await this.prisma.employee.delete({
      where: { id },
    });
    return deletedEmploye;
  }
}
