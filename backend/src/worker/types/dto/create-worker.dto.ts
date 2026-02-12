import { IsDateString, IsEmail, IsString } from "class-validator";
import { WorkerRole } from "../enums/role.enum";

export class CreateWorkerDto {
  @IsString()
  fullName: string;

  @IsString()
  displayName: string;

  @IsString()
  role: WorkerRole;

  @IsString()
  @IsEmail()
  email: string;

  @IsDateString()
  hireDate: string;
}
