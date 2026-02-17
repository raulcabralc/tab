import { CreateWorkerDto } from "../../../worker/types/dto/create-worker.dto";
import { CreateRestaurantDTO } from "./create-restaurant.dto";
import { IsObject } from "class-validator";

export class SetupDTO {
  @IsObject()
  user: CreateWorkerDto & { pin: string };

  @IsObject()
  restaurant: CreateRestaurantDTO;
}
