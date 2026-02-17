import { Module } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { RestaurantRepository } from "./restaurant.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { RestaurantSchema } from "./restaurant.schema";
import { WorkerModule } from "../worker/worker.module";

@Module({
  imports: [
    WorkerModule,

    MongooseModule.forFeature([
      { name: "Restaurant", schema: RestaurantSchema },
    ]),
  ],

  controllers: [RestaurantController],
  providers: [RestaurantService, RestaurantRepository],
  exports: [],
})
export class RestaurantModule {}
