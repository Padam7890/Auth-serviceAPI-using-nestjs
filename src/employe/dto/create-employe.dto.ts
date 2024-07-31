import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateEmployeDto {
    // name     String
    // position String
    // salary   Float
    // user     User?  @relation(fields: [userId], references: [id])
    // userId   Int

    @IsNotEmpty()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @Length(3, 50)
    position: string;

    @IsNotEmpty()
    salary: number;

    @IsNotEmpty()
    userId: number;

    
}
