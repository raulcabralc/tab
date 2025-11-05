import { Injectable } from "@nestjs/common";
import { WorkerRepository } from "./worker.repository";
import { WorkerReturn } from "./types/interfaces/return.interface";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";
import { WorkerRole } from "./types/enums/role.enum";
import { Worker } from "./worker.schema";

@Injectable()
export class WorkerService {
  constructor(private readonly workerRepository: WorkerRepository) {}

  async index() {
    return await this.workerRepository.index();
  }

  async findOne(id: string): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(id);

    if (!worker) {
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };
    }

    return worker;
  }

  async createWorker(worker: CreateWorkerDto): Promise<Worker | WorkerReturn> {
    const missingFields: string[] = [];

    const requiredFields = [
      "fullName",
      "displayName",
      "role",
      "email",
      "pin",
      "hireDate",
    ];

    for (const field of requiredFields) {
      if (!worker[field]) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      };
    }

    const workerCreation = {
      ...worker,
      pinHash: worker.pin,
    };

    if (!Object.values(WorkerRole).includes(worker.role)) {
      return {
        success: false,
        message: `Invalid role: ${worker.role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    const emailRegistered = !!(await this.workerRepository.findByEmail(
      worker.email,
    ));

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${worker.email} is already registered.`,
      };

    return await this.workerRepository.createWorker(workerCreation);
  }

  async deleteWorker(id: string): Promise<Worker | WorkerReturn> {
    const deletedWorker = await this.workerRepository.deleteWorker(id);

    if (!deletedWorker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return deletedWorker;
  }

  /// UPDATE

  async changeRole(id: string, role: string): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    if (!Object.values(WorkerRole).includes(worker.role)) {
      return {
        success: false,
        message: `Invalid role: ${role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    return await this.workerRepository.changeRole(id, role);
  }

  async changeEmail(id: string, email: string): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    const emailRegistered = !!(await this.workerRepository.findByEmail(email));

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${email} is already registered.`,
      };

    return await this.workerRepository.changeEmail(id, email);
  }

  async deactivate(id: string): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.deactivate(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return worker;
  }

  async activate(id: string): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.activate(id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return worker;
  }
}
