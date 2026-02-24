import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { WorkerRole } from "../enums/role.enum";

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  role?: WorkerRole;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  pin?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @IsOptional()
  @IsString()
  avatar?: string;
}
