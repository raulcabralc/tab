import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller("/")
export class AppController {
  constructor(@InjectConnection() private readonly db: Connection) {}

  @Get("/")
  home(): any {
    return {
      health: this.health().status,
      mongo: this.mongo().mongoStatus,
    };
  }

  @Get("/health")
  health(): any {
    return { status: "ok" };
  }

  @Get("/mongo")
  mongo(): any {
    const isConnected = this.db.readyState === 1;
    return { mongoStatus: isConnected ? "ok" : "error" };
  }
}
