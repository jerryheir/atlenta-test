import { ApiProperty } from '@nestjs/swagger';
import { Priority, Status } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  priority: Priority;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: Status;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_id: string;
}

export class EditTaskDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  priority?: Priority;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: Status;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_id: string;
}
