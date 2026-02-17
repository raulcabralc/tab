import { Worker } from "../../../worker/worker.schema";

export interface NewWorker {
  worker: Worker;
  temporaryPin: string;
  message: string;
}
