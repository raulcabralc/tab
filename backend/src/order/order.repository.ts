import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order } from "./order.schema";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderPriority } from "./types/enums/priority.enum";
import { OrderStatus } from "./types/enums/status.enum";

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<Order>,
  ) {}

  async index(restaurantId: string): Promise<Order[]> {
    const listedOrders = await this.orderModel
      .find({
        restaurantId: restaurantId,
      })
      .sort({ ordered: 1 });

    return listedOrders as Order[];
  }

  async indexDay(restaurantId: string): Promise<Order[]> {
    const todayOrders = await this.orderModel.find({
      ordered: {
        $gte: new Date(new Date().setHours(0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59)),
      },
      restaurantId,
    });

    return todayOrders as Order[];
  }

  async findOne(restaurantId: string, id: string): Promise<Order | null> {
    const foundOrder = await this.orderModel.findOne({
      _id: id,
      restaurantId: restaurantId,
    });

    return foundOrder as Order;
  }

  async createOrder(order: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.orderModel.create(order);

    return createdOrder as Order;
  }

  async deleteOrder(restaurantId: string, id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findOneAndDelete({
      _id: id,
      restaurantId: restaurantId,
    });

    return deletedOrder as Order;
  }

  /// UPDATE

  async changePriority(
    restaurantId: string,
    id: string,
    priority: OrderPriority,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
      },
      {
        priority,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async changeStatus(
    restaurantId: string,
    id: string,
    status: OrderStatus,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
      },
      {
        status,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async confirmPayment(restaurantId: string, id: string): Promise<Order> {
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
      },
      {
        isPaid: true,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async startPreparing(
    restaurantId: string,
    id: string,
    startPreparing: Date,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
      },
      {
        startedPreparing: startPreparing,
        status: OrderStatus.PREPARING,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async finishPreparing(
    restaurantId: string,
    id: string,
    finishPreparing: Date,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: id,
        restaurantId,
      },
      {
        finishedPreparing: finishPreparing,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }

  async setTransactionHandler(
    restaurantId: string,
    waiterId: string,
    waiterName: string,
    orderId: string,
  ): Promise<Order> {
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      {
        _id: orderId,
        restaurantId,
      },
      {
        transactionHandlerId: waiterId,
        transactionHandlerName: waiterName,
      },
      { new: true },
    );

    return updatedOrder as Order;
  }
}
