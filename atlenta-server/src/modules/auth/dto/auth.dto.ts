import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
