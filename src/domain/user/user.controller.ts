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
    const createUser = await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      user: createUser,
    };
  }
  //get all user http method 
  @Get()
  async findAll() {
    const userAll=  await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      users: userAll,
    }
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
   const deletedData =  await this.userService.remove(+id);
   return {
     statusCode: HttpStatus.OK,
     message: 'User deleted successfully',
     user: deletedData,
   }
  }
}
