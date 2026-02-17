import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { WorkerService } from "../worker/worker.service";
import { AuthService } from "./auth.service";
import type { Request } from "express";
import { LoginDto } from "./types/dto/login.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly workerService: WorkerService,
    private readonly authService: AuthService,
  ) {}

  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    const worker = await this.authService.validateWorker(
      loginDto.email,
      loginDto.pass,
    );

    if (!worker) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.authService.login(worker);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async me(@Req() req: Request) {
    if (!req.user) return null;

    const { restaurantId, userId } = req.user;

    return await this.authService.me(restaurantId, userId);
  }
}
