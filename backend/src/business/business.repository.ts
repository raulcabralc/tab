import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Business } from "./business.schema";
import { BusinessDTO } from "./types/dto/business.dto";
import { WeekDay } from "./types/enums/week-day.enum";
import { PaymentMethod } from "../order/types/enums/payment-method.enum";
import { Origin } from "../order/types/enums/origin.enum";
import { DailySummary } from "./types/interfaces/daily-summary.interface";
import { AverageTicket } from "./types/interfaces/average-ticket.interface";
import { SalesByOrigin } from "./types/interfaces/sales-by-origin.interface";
import { TopItems } from "./types/interfaces/top-items.interface";

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectModel("Business") private readonly businessModel: Model<Business>,
  ) {}

  async findOne(restaurantId: string, id: string): Promise<Business> {
    const business = await this.businessModel.findOne({
      _id: id,
      restaurantId: restaurantId,
    });

    return business as Business;
  }

  async findByOrderId(restaurantId: string, id: string): Promise<Business> {
    const business = await this.businessModel.findOne({
      originalOrderId: id,
      restaurantId: restaurantId,
    });

    return business as Business;
  }

  async create(business: BusinessDTO): Promise<Business> {
    const createdBusiness = await this.businessModel.create(business);

    return createdBusiness as Business;
  }

  /// CONSULTAS DE AGREGAÇÃO

  async getDailySummary(
    startOfDay: Date,
    endOfDay: Date,
    restaurantId: string,
  ): Promise<DailySummary> {
    const dailySummary = await this.businessModel.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
          restaurantId: restaurantId,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          totalDiscount: { $sum: "$discount" },
          totalDeliveryFee: { $sum: "$deliveryFee" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          totalDiscount: 1,
          totalDeliveryFee: 1,
          averageTicket: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
    ]);

    return dailySummary[0] as DailySummary;
  }

  async getAverageTicketByWaiter(
    restaurantId: string,
  ): Promise<AverageTicket[]> {
    const result = await this.businessModel.aggregate([
      {
        $match: { restaurantId: restaurantId },
      },
      {
        $group: {
          _id: "$waiterId",
          waiterName: { $first: "$waiterName" },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          waiterId: "$_id",
          waiterName: "$waiterName",
          totalRevenue: 1,
          totalOrders: 1,
          averageTicket: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
    ]);

    return result as AverageTicket[];
  }

  async getTotalSalesByOrigin(restaurantId: string): Promise<SalesByOrigin[]> {
    const result = await this.businessModel.aggregate([
      {
        $match: { restaurantId: restaurantId },
      },
      {
        $group: {
          _id: "$origin",
          origin: { $first: "$origin" },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          origin: 1,
          totalRevenue: 1,
          totalOrders: 1,
          averageTicket: { $divide: ["$totalRevenue", "$totalOrders"] },
        },
      },
    ]);

    return result as SalesByOrigin[];
  }

  async getTopSellingItems(
    restaurantId: string,
    limit: number,
  ): Promise<TopItems[]> {
    const result = await this.businessModel.aggregate([
      {
        $unwind: "$itemsDenormalized",
      },
      {
        $match: { restaurantId: restaurantId },
      },
      {
        $group: {
          _id: "$itemsDenormalized.itemId",
          itemName: { $first: "$itemsDenormalized.itemName" },
          category: { $first: "$itemsDenormalized.category" },
          totalUnitsSold: { $sum: "$itemsDenormalized.quantity" },
        },
      },
      {
        $sort: { totalUnitsSold: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          itemId: "$_id",
          itemName: 1,
          category: 1,
          totalUnitsSold: 1,
        },
      },
    ]);

    return result as TopItems[];
  }

  /// CONSULTAS GERAIS

  // DATA

  async findByDateRange(
    restaurantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      date: { $gte: startDate, $lte: endDate },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByWeekDay(
    restaurantId: string,
    weekDay: WeekDay,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      weekDay: weekDay,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByHourSlot(
    restaurantId: string,
    startHour: number,
    endHour: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      hourSlot: { $gte: startHour, $lte: endHour },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  // FINANCEIRO

  async findByDiscount(
    restaurantId: string,
    startDiscount: number,
    endDiscount: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      discount: { $gte: startDiscount, $lte: endDiscount },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByDeliveryFee(
    restaurantId: string,
    startDeliveryFee: number,
    endDeliveryFee: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      deliveryFee: { $gte: startDeliveryFee, $lte: endDeliveryFee },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByCustomerCount(
    restaurantId: string,
    startCustomers: number,
    endCustomers: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      customerCount: { $gte: startCustomers, $lte: endCustomers },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByPaymentMethod(
    restaurantId: string,
    paymentMethod: PaymentMethod,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      paymentMethod,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByOrigin(
    restaurantId: string,
    origin: Origin,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      origin,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  // ESTOQUE & PRODUTO

  async findByTotalItems(
    restaurantId: string,
    startTotalItems: number,
    endTotalItems: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      totalItemsCount: { $gte: startTotalItems, $lte: endTotalItems },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByTimeToStartPreparing(
    restaurantId: string,
    startValue: number,
    endValue: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      timeToStartPreparing: { $gte: startValue, $lte: endValue },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByTimePreparing(
    restaurantId: string,
    startTimePreparing: number,
    endTimePreparing: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      timePreparing: { $gte: startTimePreparing, $lte: endTimePreparing },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByTimeToDelivery(
    restaurantId: string,
    startTimeToDelivery: number,
    endTimeToDelivery: number,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      timeToDelivery: { $gte: startTimeToDelivery, $lte: endTimeToDelivery },
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  // FUNCIONÁRIOS & DESEMPENHO

  async findByWaiterId(
    restaurantId: string,
    waiterId: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      waiterId,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByWaiterName(
    restaurantId: string,
    waiterName: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      waiterName,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByTransactionHandlerId(
    restaurantId: string,
    transactionHandlerId: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      transactionHandlerId,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByTransactionHandlerName(
    restaurantId: string,
    transactionHandlerName: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      transactionHandlerName,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByDeliveryNeighborhood(
    restaurantId: string,
    deliveryNeighborhood: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      deliveryNeighborhood,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByCanceled(restaurantId: string): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      isCanceled: true,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }

  async findByCancelReason(
    restaurantId: string,
    reason: string,
  ): Promise<Business[]> {
    const businessList = await this.businessModel.find({
      cancellationReason: reason,
      restaurantId: restaurantId,
    });

    return businessList as Business[];
  }
}
