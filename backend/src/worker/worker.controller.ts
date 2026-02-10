import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { CreateWorkerDto } from "./types/dto/create-worker.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import type { Request } from "express";
import { WorkerRole } from "./types/enums/role.enum";
import { UpdateWorkerDto } from "./types/dto/update-worker.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { FirstLoginGuard } from "src/auth/guards/first-login.guard";

@Controller("/worker")
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Get("/")
  async index(@Req() req: Request) {
    const restaurantId = this.getRestaurantId(req);

    return await this.workerService.index(restaurantId);
  }

  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Get("/:id")
  async findOne(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.workerService.findOne(restaurantId, id);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Post("/create")
  async createWorker(@Req() req: Request, @Body() worker: CreateWorkerDto) {
    const restaurantId = this.getRestaurantId(req);

    return await this.workerService.createWorker(restaurantId, worker);
  }

  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Patch("/edit/:id")
  async updateWorker(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() worker: UpdateWorkerDto,
  ) {
    const restaurantId = this.getRestaurantId(req);

    const userId = this.getUserId(req);

    const role = this.getRole(req);

    if (userId !== id) {
      if (!this.isAdminOrManager(role)) {
        throw new UnauthorizedException(
          "Route restricted to roles: ADMIN, MANAGER, OWN USER",
        );
      }
    }

    return await this.workerService.updateWorker(
      restaurantId,
      role,
      id,
      worker,
    );
  }

  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Delete("/delete/:id")
  async deleteWorker(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    const userId = this.getUserId(req);

    const role = this.getRole(req);

    if (userId !== id) {
      if (!this.isAdminOrManager(role)) {
        throw new UnauthorizedException(
          "Route restricted to roles: ADMIN, MANAGER, OWN USER",
        );
      }
    }

    return await this.workerService.deleteWorker(restaurantId, id);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Patch("/deactivate/:id")
  async deactivate(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    const userId = this.getUserId(req);

    const role = this.getRole(req);

    if (userId !== id) {
      if (!this.isAdminOrManager(role)) {
        throw new UnauthorizedException(
          "Route restricted to roles: ADMIN, MANAGER, OWN USER",
        );
      }
    }

    return await this.workerService.deactivate(restaurantId, id);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Patch("/activate/:id")
  async activate(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    const userId = this.getUserId(req);

    const role = this.getRole(req);

    if (userId !== id) {
      if (!this.isAdminOrManager(role)) {
        throw new UnauthorizedException(
          "Route restricted to roles: ADMIN, MANAGER, OWN USER",
        );
      }
    }

    return await this.workerService.activate(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Patch("/update-pin")
  async updatePin(@Req() req: Request, @Body("pin") pin: string) {
    const restaurantId = this.getRestaurantId(req);

    const userId = this.getUserId(req);

    return await this.workerService.updatePin(restaurantId, userId, pin);
  }

  ///

  private getRestaurantId(req: Request) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("You must log in to use this route");
    }

    return restaurantId;
  }

  private getUserId(req: Request) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new UnauthorizedException("You must log in to use this route");
    }

    return userId;
  }

  private getRole(req: Request) {
    const role = req.user?.role;

    if (!role) {
      throw new UnauthorizedException("You must log in to use this route");
    }

    return role as WorkerRole;
  }

  private isAdminOrManager(role: WorkerRole) {
    return [WorkerRole.ADMIN, WorkerRole.MANAGER].includes(role);
  }
}
