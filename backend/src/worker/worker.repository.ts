import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";
import { Worker } from "./worker.schema";
import { UpdateWorkerDto } from "./types/dto/update-worker.dto";

@Injectable()
export class WorkerRepository {
  constructor(
    @InjectModel("Worker") private readonly workerModel: Model<Worker>,
  ) {}

  async index(restaurantId: string): Promise<Worker[]> {
    const listedWorkers = await this.workerModel
      .find({ restaurantId })
      .select("-pinHash")
      .sort({ hireDate: -1 });

    return listedWorkers as Worker[];
  }

  async findOne(restaurantId: string, id: string): Promise<Worker> {
    const worker = await this.workerModel
      .findOne({
        _id: id,
        restaurantId,
      })
      .select("-pinHash");

    return worker as Worker;
  }

  async createWorker(worker: CreateWorkerDto): Promise<Worker> {
    const createdWorker = await this.workerModel.create(worker);

    return createdWorker as Worker;
  }

  async updateWorker(
    restaurantId: string,
    id: string,
    worker: UpdateWorkerDto,
  ) {
    const updateData: any = {};

    if (worker.fullName !== undefined) updateData.fullName = worker.fullName;
    if (worker.displayName !== undefined)
      updateData.displayName = worker.displayName;
    if (worker.role !== undefined) updateData.role = worker.role;
    if (worker.email !== undefined) updateData.email = worker.email;
    if (worker.pin !== undefined) updateData.pinHash = worker.pin;
    if (worker.hireDate !== undefined) updateData.hireDate = worker.hireDate;

    const updatedWorker = await this.workerModel
      .findOneAndUpdate(
        {
          _id: id,
          restaurantId,
        },
        updateData,
        { new: true },
      )
      .select("-pinHash");

    return updatedWorker as Worker;
  }

  async deleteWorker(restaurantId: string, id: string): Promise<Worker> {
    const deletedWorker = await this.workerModel
      .findOneAndDelete({
        _id: id,
        restaurantId,
      })
      .select("-pinHash");

    return deletedWorker as Worker;
  }

  /// UPDATE

  async changeRole(
    restaurantId: string,
    id: string,
    role: string,
  ): Promise<Worker> {
    const updatedWorker = await this.workerModel
      .findOneAndUpdate(
        {
          _id: id,
          restaurantId,
        },
        { role },
        { new: true },
      )
      .select("-pinHash");

    return updatedWorker as Worker;
  }

  async changeEmail(
    restaurantId: string,
    id: string,
    email: string,
  ): Promise<Worker> {
    const updatedWorker = await this.workerModel
      .findOneAndUpdate(
        {
          _id: id,
          restaurantId,
        },
        { email },
        { new: true },
      )
      .select("-pinHash");

    return updatedWorker as Worker;
  }

  async deactivate(restaurantId: string, id: string) {
    const updatedWorker = await this.workerModel
      .findOneAndUpdate(
        {
          _id: id,
          restaurantId,
        },
        { isActive: false },
        { new: true },
      )
      .select("-pinHash");

    return updatedWorker as Worker;
  }

  async activate(restaurantId: string, id: string) {
    const updatedWorker = await this.workerModel
      .findOneAndUpdate(
        {
          _id: id,
          restaurantId,
        },
        { isActive: true },
        { new: true },
      )
      .select("-pinHash");

    return updatedWorker as Worker;
  }

  async updatePin(restaurantId: string, id: string, pin: string) {
    const updatedWorker = await this.workerModel
      .findOneAndUpdate(
        {
          _id: id,
          restaurantId,
        },
        { pinHash: pin, isFirstLogin: false },
        { new: true },
      )
      .select("-pinHash");

    return updatedWorker as Worker;
  }

  async forgotPassword(email: string, resetToken: string, expires: Date) {
    const updatedWorker = await this.workerModel.findOneAndUpdate(
      {
        email,
      },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expires,
      },
      { new: true },
    );

    return updatedWorker as Worker;
  }

  async resetPassword(restaurantId: string, userId: string) {
    const updatedWorker = await this.workerModel.findOneAndUpdate(
      {
        _id: userId,
        restaurantId,
      },
      {
        resetPasswordExpires: null,
        resetPasswordToken: null,
      },
      { new: true },
    );

    return updatedWorker as Worker;
  }

  /// UTILS

  async findByEmail(restaurantId: string, email: string): Promise<Worker> {
    const worker = await this.workerModel
      .findOne({ restaurantId, email })
      .select("-pinHash");

    return worker as Worker;
  }

  async strictFindByEmail(email: string): Promise<Worker> {
    const worker = await this.workerModel.findOne({ email });

    return worker as Worker;
  }

  async findByResetToken(token: string): Promise<Worker> {
    const worker = await this.workerModel.findOne({
      resetPasswordToken: token,
    });

    return worker as Worker;
  }
}
