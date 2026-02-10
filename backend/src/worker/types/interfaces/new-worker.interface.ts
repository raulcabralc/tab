import { Worker } from "src/worker/worker.schema";

export interface NewWorker {
  worker: Worker;
  temporaryPin: string;
  message: string;
}
