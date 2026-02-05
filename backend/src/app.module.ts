import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { OrderModule } from "./order/order.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkerModule } from "./worker/worker.module";
import { BusinessModule } from "./business/business.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { AuthModule } from "./auth/auth.module";
import { RestaurantModule } from "./restaurant/restaurant.module";

@Module({
  imports: [
    OrderModule,
    WorkerModule,
    BusinessModule,
    RestaurantModule,
    AuthModule,
    NotificationsModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbUri = configService.get("DB_URI");

        return {
          uri: `${dbUri}${dbUri.endsWith("/") ? "" : "/"}BarApp`,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
