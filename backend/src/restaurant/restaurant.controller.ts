import {
  BadRequestException,
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
import { RestaurantService } from "./restaurant.service";
import { CreateRestaurantDTO } from "./types/dto/create-restaurant.dto";
import { Restaurant } from "./restaurant.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import type { Request } from "express";
import { FirstLoginGuard } from "src/auth/guards/first-login.guard";
import { WorkerRole } from "src/worker/types/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { SetupDTO } from "./types/dto/setup.dto";

@Controller("/restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Roles(WorkerRole.ADMIN)
  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Get("/:id")
  async findOne(@Param("id") id: string, @Req() req: Request) {
    if (!req.user)
      throw new BadRequestException("Log in before using this route");

    return await this.restaurantService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Post("/create")
  async create(@Body() restaurant: CreateRestaurantDTO) {
    return await this.restaurantService.create(restaurant);
  }

  @Roles(WorkerRole.ADMIN)
  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Patch("/update/:id")
  async update(
    @Param("id") id: string,
    @Body() restaurant: Partial<Restaurant>,
  ) {
    return await this.restaurantService.update(id, restaurant);
  }

  @Roles(WorkerRole.ADMIN)
  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Delete("/delete/:id")
  async delete(@Param("id") id: string) {
    return await this.restaurantService.delete(id);
  }

  @Post("/setup")
  async setup(@Body() setup: SetupDTO) {
    return await this.restaurantService.setup(setup);
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
