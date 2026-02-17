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
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FirstLoginGuard } from "../auth/guards/first-login.guard";
import { WorkerRole } from "../worker/types/enums/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";
import { SetupDTO } from "./types/dto/setup.dto";
import { RolesGuard } from "../auth/guards/roles.guard";

@Controller("/restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Roles(WorkerRole.ADMIN)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Get("/:id")
  async findOne(@Param("id") id: string) {
    return await this.restaurantService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, FirstLoginGuard)
  @Post("/create")
  async create(@Body() restaurant: CreateRestaurantDTO) {
    return await this.restaurantService.create(restaurant);
  }

  @Roles(WorkerRole.ADMIN)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Patch("/update/:id")
  async update(
    @Param("id") id: string,
    @Body() restaurant: Partial<Restaurant>,
  ) {
    return await this.restaurantService.update(id, restaurant);
  }

  @Roles(WorkerRole.ADMIN)
  @UseGuards(JwtAuthGuard, FirstLoginGuard, RolesGuard)
  @Delete("/delete/:id")
  async delete(@Param("id") id: string) {
    return await this.restaurantService.delete(id);
  }

  @Post("/setup")
  async setup(@Body() setup: SetupDTO) {
    return await this.restaurantService.setup(setup);
  }
}
