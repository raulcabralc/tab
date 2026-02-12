import { Injectable, UnauthorizedException } from "@nestjs/common";
import { WorkerRepository } from "./worker.repository";
import { WorkerReturn } from "./types/interfaces/return.interface";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";
import { WorkerRole } from "./types/enums/role.enum";
import { Worker } from "./worker.schema";
import * as bcrypt from "bcrypt";
import { UpdateWorkerDto } from "./types/dto/update-worker.dto";
import { NewWorker } from "./types/interfaces/new-worker.interface";

@Injectable()
export class WorkerService {
  constructor(private readonly workerRepository: WorkerRepository) {}

  async index(restaurantId: string) {
    return await this.workerRepository.index(restaurantId);
  }

  async findOne(
    restaurantId: string,
    id: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(restaurantId, id);

    if (!worker) {
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };
    }

    return worker;
  }

  async findByEmail(
    restaurantId: string,
    email: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findByEmail(restaurantId, email);

    if (!worker) {
      return {
        success: false,
        message: `Worker with email ${email} not found.`,
      };
    }

    return worker;
  }

  async createWorker(
    restaurantId: string,
    worker: CreateWorkerDto,
  ): Promise<NewWorker | WorkerReturn> {
    const missingFields: string[] = [];

    const requiredFields = [
      "fullName",
      "displayName",
      "role",
      "email",
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

    const pin = this.randomPin();

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);

    const workerCreation = {
      ...worker,
      pinHash,
      isFirstLogin: true,
      restaurantId,
    };

    if (!Object.values(WorkerRole).includes(worker.role)) {
      return {
        success: false,
        message: `Invalid role: ${worker.role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    const emailRegistered = !!(await this.workerRepository.strictFindByEmail(
      worker.email,
    ));

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${worker.email} is already registered.`,
      };

    const createdWorker =
      await this.workerRepository.createWorker(workerCreation);

    return {
      worker: createdWorker,
      temporaryPin: pin,
      message: `Worker created successfully. Share this temporary PIN: ${pin}`,
    };
  }

  async updateWorker(
    restaurantId: string,
    role: WorkerRole,
    id: string,
    worker: UpdateWorkerDto,
  ): Promise<Worker | WorkerReturn> {
    const workerFound = await this.workerRepository.findOne(restaurantId, id);

    if (!workerFound) {
      return {
        success: false,
        message: "Worker not found.",
      };
    }

    let workerUpdate = {
      ...worker,
    };

    if (worker.pin) {
      if (worker.pin.length < 4) {
        return {
          success: false,
          message: "Pin must be at least 4 characters long.",
        };
      }

      const salt = await bcrypt.genSalt(10);
      const pinHash = await bcrypt.hash(worker.pin, salt);

      workerUpdate.pin = pinHash;
    }

    const requiredFields = [
      "fullName",
      "displayName",
      "role",
      "email",
      "hireDate",
    ];

    const restrictedFields = ["fullName", "role", "hireDate"];

    for (const field of requiredFields) {
      if (!workerUpdate[field]) {
        workerUpdate[field] = workerFound[field];
      }

      if (restrictedFields.includes(field)) {
        if (!Object.values(WorkerRole).includes(role)) {
          return {
            success: false,
            message: `Invalid role: ${worker.role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
          };
        }

        if (![WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role)) {
          throw new UnauthorizedException(
            "fullName, role and hireDate are user edits restricted to: ADMIN, MANAGER",
          );
        }
      }
    }

    if (worker.email) {
      const emailRegistered = !!(await this.workerRepository.strictFindByEmail(
        worker.email,
      ));

      if (emailRegistered)
        return {
          success: false,
          message: `Email ${worker.email} is already registered.`,
        };

      worker.email = worker.email.trim().toLowerCase();
    }

    return await this.workerRepository.updateWorker(
      restaurantId,
      id,
      workerUpdate,
    );
  }

  async deleteWorker(
    restaurantId: string,
    id: string,
  ): Promise<Worker | WorkerReturn> {
    const deletedWorker = await this.workerRepository.deleteWorker(
      restaurantId,
      id,
    );

    if (!deletedWorker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return deletedWorker;
  }

  async createWorkerSetup(
    restaurantId: string,
    worker: CreateWorkerDto & { pin: string },
  ): Promise<Worker | WorkerReturn> {
    const missingFields: string[] = [];

    const requiredFields = [
      "fullName",
      "displayName",
      "role",
      "email",
      "hireDate",
      "pin",
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

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(worker.pin, salt);

    const workerCreation = {
      ...worker,
      pinHash,
      isFirstLogin: true,
      restaurantId,
    };

    if (!Object.values(WorkerRole).includes(worker.role)) {
      return {
        success: false,
        message: `Invalid role: ${worker.role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    const emailRegistered = await this.workerRepository.strictFindByEmail(
      worker.email,
    );

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${worker.email} is already registered.`,
      };

    const createdWorker =
      await this.workerRepository.createWorker(workerCreation);

    return createdWorker;
  }

  /// UPDATE

  async changeRole(
    restaurantId: string,
    id: string,
    role: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(restaurantId, id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    if (!Object.values(WorkerRole).includes(role as WorkerRole)) {
      return {
        success: false,
        message: `Invalid role: ${role}. Allowed roles: ADMIN, MANAGER, CHEF, BARTENDER, WAITER, DELIVERY`,
      };
    }

    return await this.workerRepository.changeRole(restaurantId, id, role);
  }

  async changeEmail(
    restaurantId: string,
    id: string,
    email: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(restaurantId, id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    const emailRegistered = !!(await this.workerRepository.findByEmail(
      restaurantId,
      email,
    ));

    if (emailRegistered)
      return {
        success: false,
        message: `Email ${email} is already registered.`,
      };

    return await this.workerRepository.changeEmail(restaurantId, id, email);
  }

  async deactivate(
    restaurantId: string,
    id: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.deactivate(restaurantId, id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return worker;
  }

  async activate(
    restaurantId: string,
    id: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.activate(restaurantId, id);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${id} not found.`,
      };

    return worker;
  }

  async updatePin(
    restaurantId: string,
    userId: string,
    pin: string,
  ): Promise<Worker | WorkerReturn> {
    const worker = await this.workerRepository.findOne(restaurantId, userId);

    if (!worker)
      return {
        success: false,
        message: `Worker with id ${userId} not found.`,
      };

    if (!worker.isFirstLogin) {
      return {
        success: false,
        message: "Worker already made the first PIN change.",
      };
    }

    if (!pin || pin.length < 4) {
      return {
        success: false,
        message: "PIN must be at least 4 characters long.",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const pinHash = await bcrypt.hash(pin, salt);

    return await this.workerRepository.updatePin(restaurantId, userId, pinHash);
  }

  ///

  private randomPin() {
    const pin = Math.floor(
      Math.random() * (999999 - 100000 + 1) + 100000,
    ).toString();
    return pin;
  }

  async strictFindByEmail(email: string) {
    return (await this.workerRepository.strictFindByEmail(email)) || null;
  }
}
