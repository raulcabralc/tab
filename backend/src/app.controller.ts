import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller("/")
export class AppController {
  constructor(@InjectConnection() private readonly db: Connection) {}

  @Get("/")
  async home(): Promise<any> {
    return {
      health: this.health().status,
      mongo: await this.mongo(),
    };
  }

  @Get("/health")
  health(): any {
    return { status: "ok" };
  }

  @Get("/mongo")
  async mongo(): Promise<any> {
    if (this.db.readyState === 2) {
      await this.waitForConnection(2000);
    }

    const isConnected = this.db.readyState === 1;
    return { mongoStatus: isConnected ? "ok" : "error" };
  }

  ///

  private waitForConnection(timeout: number): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (this.db.readyState === 1 || Date.now() - start > timeout) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
}
