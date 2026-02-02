import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WorkerService } from "src/worker/worker.service";
import * as bcrypt from "bcrypt";
import { Worker } from "src/worker/worker.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly workerService: WorkerService,
    private readonly jwtService: JwtService,
  ) {}

  async validateWorker(email: string, pass: string): Promise<any> {
    const worker = (await this.workerService.findByEmail(email)) as Worker;

    if (!worker || !worker.pinHash) return null;

    if (worker && (await bcrypt.compare(pass, worker.pinHash))) {
      const { pinHash, ...result } = worker;
      return result;
    }

    return null;
  }

  async login(worker: any) {
    const payload = {
      sub: worker._doc._id.toString(),
      email: worker._doc.email,
      role: worker._doc.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async me(id: string) {
    return await this.workerService.findOne(id);
  }
}
