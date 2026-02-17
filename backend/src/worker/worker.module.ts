import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WorkerSchema } from "./worker.schema";
import { WorkerRepository } from "./worker.repository";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    MailModule,

    MongooseModule.forFeature([{ name: "Worker", schema: WorkerSchema }]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService, WorkerRepository],
  exports: [WorkerRepository, WorkerService],
})
export class WorkerModule {}
