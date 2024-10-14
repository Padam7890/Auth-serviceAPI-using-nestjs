import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

//user controller
@Controller('user')
@ApiExcludeController()
export class UserController {
  constructor(private readonly userService: UserService) {}

  //create user http method
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
  //get all user http method
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  //get user by id http method
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findoneByid(+id);
  }

  //update user http method
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  //delete user http method
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
