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

@Controller("/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async index(@Req() req: Request) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.index(restaurantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async findOne(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.findOne(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/create")
  async createOrder(@Req() req: Request, @Body() order: CreateOrderDto) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.createOrder(restaurantId, order);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:id")
  async deleteOrder(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.deleteOrder(restaurantId, id);
  }

  /// UPDATE

  @UseGuards(JwtAuthGuard)
  @Patch("/priority/:id/:priority")
  async changePriority(
    @Req() req: Request,
    @Param("id") id: string,
    @Param("priority") priority: OrderPriority,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.changePriority(restaurantId, id, priority);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/status/:id/:status")
  async changeStatus(
    @Req() req: Request,
    @Param("id") id: string,
    @Param("status") status: OrderStatus,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.changeStatus(restaurantId, id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/confirm/:id")
  async confirmPayment(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.confirmPayment(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/start/:id")
  async startPreparing(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.startPreparing(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/finish/:id")
  async finishPreparing(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.finishPreparing(restaurantId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/transaction/:waiterId/:orderId")
  async setTransactionHandler(
    @Req() req: Request,
    @Param("waiterId") waiterId: string,
    @Param("orderId") orderId: string,
  ) {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      throw new UnauthorizedException("Restaurant ID not found");
    }

    return await this.orderService.setTransactionHandler(
      restaurantId,
      waiterId,
      orderId,
    );
  }
}
