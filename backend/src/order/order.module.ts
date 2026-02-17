import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderSchema } from "./order.schema";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { OrderController } from "./order.controller";
import { BusinessModule } from "../business/business.module";
import { WorkerModule } from "../worker/worker.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    BusinessModule,
    WorkerModule,
    NotificationsModule,

    MongooseModule.forFeature([{ name: "Order", schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [],
})
export class OrderModule {}
