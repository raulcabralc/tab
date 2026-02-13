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
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderService } from "./order.service";
import { OrderPriority } from "./types/enums/priority.enum";
import { OrderStatus } from "./types/enums/status.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import type { Request } from "express";
import { Roles } from "src/auth/decorators/roles.decorator";
import { WorkerRole } from "src/worker/types/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller("/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async index(@Req() req: Request) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.index(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async findOne(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.findOne(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  async createOrder(@Req() req: Request, @Body() order: CreateOrderDto) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.createOrder(restaurantId, order);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete("/delete/:id")
  async deleteOrder(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.deleteOrder(restaurantId, id);
  }

  /// UPDATE

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER, WorkerRole.WAITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/priority/:id/:priority")
  async changePriority(
    @Req() req: Request,
    @Param("id") id: string,
    @Param("priority") priority: OrderPriority,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.changePriority(restaurantId, id, priority);
  }

  @Roles(
    WorkerRole.ADMIN,
    WorkerRole.MANAGER,
    WorkerRole.WAITER,
    WorkerRole.BARTENDER,
    WorkerRole.CHEF,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/status/:id/:status")
  async changeStatus(
    @Req() req: Request,
    @Param("id") id: string,
    @Param("status") status: OrderStatus,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.changeStatus(restaurantId, id, status);
  }

  @Roles(
    WorkerRole.ADMIN,
    WorkerRole.MANAGER,
    WorkerRole.WAITER,
    WorkerRole.BARTENDER,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/confirm/:id")
  async confirmPayment(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.confirmPayment(restaurantId, id);
  }

  @Roles(
    WorkerRole.ADMIN,
    WorkerRole.MANAGER,
    WorkerRole.BARTENDER,
    WorkerRole.CHEF,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/start/:id")
  async startPreparing(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.startPreparing(restaurantId, id);
  }

  @Roles(
    WorkerRole.ADMIN,
    WorkerRole.MANAGER,
    WorkerRole.BARTENDER,
    WorkerRole.CHEF,
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/finish/:id")
  async finishPreparing(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.finishPreparing(restaurantId, id);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER, WorkerRole.WAITER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch("/transaction/:waiterId/:orderId")
  async setTransactionHandler(
    @Req() req: Request,
    @Param("waiterId") waiterId: string,
    @Param("orderId") orderId: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.orderService.setTransactionHandler(
      restaurantId,
      waiterId,
      orderId,
    );
  }

  ///

  private getRestaurantId(req: Request) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("You must log in to use this route");
    }

    return restaurantId;
  }
}
