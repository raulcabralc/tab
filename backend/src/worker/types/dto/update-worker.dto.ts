import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator";
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
  pin?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: Date;
}
