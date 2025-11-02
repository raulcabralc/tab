import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { OrderModule } from "./order/order.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    OrderModule,

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
