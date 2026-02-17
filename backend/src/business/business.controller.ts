import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { BusinessService } from "./business.service";
import { WeekDay } from "./types/enums/week-day.enum";
import { PaymentMethod } from "../order/types/enums/payment-method.enum";
import { Origin } from "../order/types/enums/origin.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { Request } from "express";
import { WorkerRole } from "../worker/types/enums/role.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller("/business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/:id")
  async findOne(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findOne(restaurantId, id);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/order/:id")
  async findByOrderId(@Req() req: Request, @Param("id") id: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByOrderId(restaurantId, id);
  }

  /// CONSULTAS AGREGADAS

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/daily-summary")
  async getDailySummary(@Req() req: Request, @Query("date") date?: string) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.getDailySummary(restaurantId, date);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/average-ticket-by-waiter")
  async getAverageTicketByWaiter(@Req() req: Request) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.getAverageTicketByWaiter(restaurantId);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/total-sales-by-origin")
  async getTotalSalesByOrigin(@Req() req: Request) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.getTotalSalesByOrigin(restaurantId);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/top-selling-items")
  async getTopSellingItems(
    @Req() req: Request,
    @Query("limit") limit?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.getTopSellingItems(restaurantId, limit);
  }

  /// CONSULTAS GERAIS

  // DATA

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/date-range")
  async findByDateRange(
    @Req() req: Request,
    @Query("startValue") startValue: Date,
    @Query("endValue") endValue?: Date,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByDateRange(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/week-day")
  async findByWeekDay(@Req() req: Request, @Query("weekDay") weekDay: WeekDay) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByWeekDay(restaurantId, weekDay);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/hour-slot")
  async findByHourSlot(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByHourSlot(
      restaurantId,
      startValue,
      endValue,
    );
  }

  // FINANCEIRO

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/discount")
  async findByDiscount(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByDiscount(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/delivery-fee")
  async findByDeliveryFee(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByDeliveryFee(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/customer-count")
  async findByCustomerCount(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByCustomerCount(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/payment-method")
  async findByPaymentMethod(
    @Req() req: Request,
    @Query("paymentMethod") paymentMethod: PaymentMethod,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByPaymentMethod(
      restaurantId,
      paymentMethod,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/origin")
  async findByOrigin(@Req() req: Request, @Query("origin") origin: Origin) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByOrigin(restaurantId, origin);
  }

  // ESTOQUE & PRODUTO

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("/total-items")
  async findByTotalItems(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByTotalItems(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("time-to-start")
  async findByTimeToStartValue(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByTimeToStartPreparing(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("time-preparing")
  async findByTimePreparing(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByTimePreparing(
      restaurantId,
      startValue,
      endValue,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("time-to-delivery")
  async findByTimeToDelivery(
    @Req() req: Request,
    @Query("startValue") startValue: number,
    @Query("endValue") endValue?: number,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByTimeToDelivery(
      restaurantId,
      startValue,
      endValue,
    );
  }

  // FUNCIONÁRIOS & DESEMPENHO

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("waiter-id")
  async findByWaiterId(
    @Req() req: Request,
    @Query("waiterId") waiterId: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByWaiterId(restaurantId, waiterId);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("waiter-name")
  async findByWaiterName(
    @Req() req: Request,
    @Query("waiterName") waiterName: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByWaiterName(
      restaurantId,
      waiterName,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("transaction-handler-id")
  async findByTransactionHandlerId(
    @Req() req: Request,
    @Query("transactionHandlerId") transactionHandlerId: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByTransactionHandlerId(
      restaurantId,
      transactionHandlerId,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("transaction-handler-name")
  async findByTransactionHandlerName(
    @Req() req: Request,
    @Query("transactionHandlerName") transactionHandlerName: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByTransactionHandlerName(
      restaurantId,
      transactionHandlerName,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("delivery-neighborhood")
  async findByDeliveryNeighborhood(
    @Req() req: Request,
    @Query("neighborhood") neighborhood: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByDeliveryNeighborhood(
      restaurantId,
      neighborhood,
    );
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("canceled")
  async findByCanceled(@Req() req: Request) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByCanceled(restaurantId);
  }

  @Roles(WorkerRole.ADMIN, WorkerRole.MANAGER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get("cancel-reason")
  async findByCancelReason(
    @Req() req: Request,
    @Query("reason") reason: string,
  ) {
    const restaurantId = this.getRestaurantId(req);

    return await this.businessService.findByCancelReason(restaurantId, reason);
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
