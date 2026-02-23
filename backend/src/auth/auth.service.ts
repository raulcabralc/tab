import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WorkerService } from "../worker/worker.service";
import * as bcrypt from "bcrypt";
import { Worker } from "../worker/worker.schema";
import { randomBytes } from "crypto";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly workerService: WorkerService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateWorker(email: string, pass: string): Promise<any> {
    const worker = (await this.workerService.strictFindByEmail(
      email,
    )) as Worker;

    if (!worker || !worker.pinHash) return null;

    if (worker && (await bcrypt.compare(pass, worker.pinHash))) {
      const { pinHash, ...result } = worker;
      return result;
    }

    return null;
  }

  async login(worker: any) {
    const w = worker._doc;

    const payload = {
      sub: w._id.toString(),
      email: w.email,
      role: w.role,
      restaurant: w.restaurantId.toString(),
      isFirstLogin: w.isFirstLogin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      isFirstLogin: w.isFirstLogin,
    };
  }

  async me(restaurantId: string, id: string) {
    return await this.workerService.findOne(restaurantId, id);
  }

  async forgotPassword(email: string) {
    const resetCode = this.randomCode();

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15);

    const worker = (await this.workerService.forgotPassword(
      email,
      resetCode,
      expires,
    )) as Worker;

    if (worker.email) {
      await this.mailService.sendResetPassword(
        email,
        worker.displayName,
        resetCode,
      );
    }

    return worker;
  }

  async resetPassword(code: string, newPin: string) {
    return await this.workerService.resetPassword(code, newPin);
  }

  private randomCode() {
    const code = Math.floor(
      Math.random() * (999999 - 100000 + 1) + 100000,
    ).toString();
    return code;
  }
}
