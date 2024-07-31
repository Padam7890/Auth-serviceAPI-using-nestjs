import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty()
  password: string;


  @IsNotEmpty({ message: 'name is required' })
  @ApiProperty()
  name: string;
}
