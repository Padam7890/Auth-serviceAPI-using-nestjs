import { Test, TestingModule } from '@nestjs/testing';
import { EmployeController } from './employe.controller';
import { EmployeService } from './employe.service';

describe('EmployeController', () => {
  let controller: EmployeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeController],
      providers: [EmployeService],
    }).compile();

    controller = module.get<EmployeController>(EmployeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
