import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderType } from "./types/enums/type.enum";
import { OrderStatus } from "./types/enums/status.enum";
import { Order } from "./order.schema";
import type { OrderReturn } from "./types/interfaces/return.interface";
import { OrderPriority } from "./types/enums/priority.enum";
import { PaymentMethod } from "./types/enums/payment-method.enum";
import { Origin } from "./types/enums/origin.enum";
import { BusinessRepository } from "src/business/business.repository";
import { BusinessDTO } from "src/business/types/dto/business.dto";
import { WeekDay } from "src/business/types/enums/week-day.enum";
import { WorkerRepository } from "src/worker/worker.repository";

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly businessRepository: BusinessRepository,
    private readonly workerRepository: WorkerRepository,
  ) {}

  async index() {
    return await this.orderRepository.index();
  }

  async findOne(id: string): Promise<Order | OrderReturn> {
    const order = await this.orderRepository.findOne(id);

    if (!order)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return order;
  }

  async createOrder(order: CreateOrderDto): Promise<Order | OrderReturn> {
    const missingFields: string[] = [];

    const requiredFields = [
      "hourSlot",
      "priority",
      "number",
      "items",
      "type",
      "waiterId",
      "waiterName",
      "transactionHandlerId",
      "transactionHandlerName",
      "subtotal",
      "discount",
      "total",
      "amountPaid",
      "paymentMethod",
      "origin",
    ];

    const addressFields = [
      "cep",
      "street",
      "number",
      "neighborhood",
      "city",
      "complement",
    ];

    const itemsFields = [
      "itemId",
      "itemName",
      "category",
      "quantity",
      "ingredients",
      "unitPrice",
    ];

    for (const field of requiredFields) {
      if (!(field in order)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    if (!order.tableNumber && !order.address) {
      if (order.type === OrderType.TABLE) {
        return {
          success: false,
          message: "TableNumber is required for table orders.",
        };
      } else {
        return {
          success: false,
          message: "Address is required for delivery orders.",
        };
      }
    }

    if (order.address && order.tableNumber) {
      if (order.type === OrderType.TABLE) {
        return {
          success: false,
          message: "Address should not be provided for table orders.",
        };
      }
    }

    const missingAddressFields: string[] = [];

    if (order.address) {
      for (const field of addressFields) {
        if (!order.address[field]) {
          missingAddressFields.push(field);
        }
      }
    }

    if (missingAddressFields.length > 0) {
      return {
        success: false,
        message: `Missing required address fields: ${missingAddressFields.join(", ")}`,
      };
    }

    const missingItemsFields: string[] = [];

    if (order.items) {
      for (const item of order.items) {
        for (const field of itemsFields) {
          if (!(field in item)) {
            missingItemsFields.push(field);
          }
        }
      }
    }

    if (missingItemsFields.length > 0) {
      return {
        success: false,
        message: `Missing required items fields: ${missingItemsFields.join(", ")}`,
      };
    }

    if (!Object.values(OrderType).includes(order.type)) {
      return {
        success: false,
        message: `Invalid type value: ${order.type}. Valid types: ${Object.values(OrderType).join(", ")}`,
      };
    }

    if (!Object.values(PaymentMethod).includes(order.paymentMethod)) {
      return {
        success: false,
        message: `Invalid paymentMethod value: ${order.paymentMethod}. Valid methods: ${Object.values(PaymentMethod).join(", ")}`,
      };
    }

    if (!Object.values(Origin).includes(order.origin)) {
      return {
        success: false,
        message: `Invalid origin value: ${order.origin}. Valid origins: ${Object.values(Origin).join(", ")}`,
      };
    }

    const orderCreation = {
      ...order,
      status: OrderStatus.PENDING,
      ordered: new Date(),
      change: parseFloat((order.amountPaid - order.total).toFixed(2)),
      isPaid: false,
      startedPreparing: null,
      finishedPreparing: null,
    };

    return await this.orderRepository.createOrder(orderCreation);
  }

  async deleteOrder(id: string): Promise<Order | OrderReturn> {
    const deletedOrder = await this.orderRepository.deleteOrder(id);

    if (!deletedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return deletedOrder;
  }

  /// UPDATE

  async changePriority(
    id: string,
    priority: OrderPriority,
  ): Promise<Order | OrderReturn> {
    if (!Object.values(OrderPriority).includes(priority)) {
      return {
        success: false,
        message: `Invalid priority value: ${priority}. Accepted values: HIGH, NORMAL.`,
      };
    }

    const updatedOrder = await this.orderRepository.changePriority(
      id,
      priority,
    );

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return updatedOrder;
  }

  async changeStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order | OrderReturn> {
    if (!Object.values(OrderStatus).includes(status)) {
      return {
        success: false,
        message: `Invalid status value: ${status}. Accepted values: ${Object.values(
          OrderStatus,
        ).join(", ")}.`,
      };
    }

    const updatedOrder = await this.orderRepository.changeStatus(id, status);

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    if (["CANCELED", "DONE", "SERVED"].includes(status)) {
      const todayWeekDay = new Date().getDay();
      let day: WeekDay;

      if (todayWeekDay === 0) {
        day = WeekDay.SUNDAY;
      } else if (todayWeekDay === 1) {
        day = WeekDay.MONDAY;
      } else if (todayWeekDay === 2) {
        day = WeekDay.TUESDAY;
      } else if (todayWeekDay === 3) {
        day = WeekDay.WEDNESDAY;
      } else if (todayWeekDay === 4) {
        day = WeekDay.THURSDAY;
      } else if (todayWeekDay === 5) {
        day = WeekDay.FRIDAY;
      } else {
        day = WeekDay.SATURDAY;
      }

      if (!updatedOrder.startedPreparing || !updatedOrder.finishedPreparing) {
        return {
          success: false,
          message: `Order ${id} missing preparation timestamps, skipping business report`,
        };
      }

      let orderRelatory: BusinessDTO = {
        originalOrderId: id,
        date: new Date().toISOString().split("T")[0],
        weekDay: day,
        hourSlot: updatedOrder.hourSlot,
        subtotal: updatedOrder.subtotal,
        discount: updatedOrder.discount,
        deliveryFee:
          updatedOrder.type === OrderType.DELIVERY
            ? updatedOrder.deliveryFee
            : undefined,
        total: updatedOrder.total,
        customerCount: updatedOrder.customerCount,
        paymentMethod: updatedOrder.paymentMethod,
        origin: updatedOrder.origin,
        itemsDenormalized: updatedOrder.items.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          category: item.category,
          quantity: item.quantity,
          ingredients: item.ingredients,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          modifications: item.observation,
        })),
        totalItemsCount: updatedOrder.items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        ),
        waiterId: updatedOrder.waiterId,
        waiterName: updatedOrder.waiterName,
        transactionHandlerId: updatedOrder.transactionHandlerId,
        transactionHandlerName: updatedOrder.transactionHandlerName,
        timePreparing: Math.round(
          (updatedOrder.finishedPreparing.getTime() -
            updatedOrder.startedPreparing.getTime()) /
            60000,
        ),
        orderType: updatedOrder.type,
        timeToStartPreparing: Math.round(
          (updatedOrder.startedPreparing.getTime() -
            updatedOrder.ordered.getTime()) /
            60000,
        ),
        deliveryNeighborhood:
          updatedOrder.type === OrderType.DELIVERY
            ? updatedOrder.address.neighborhood
            : undefined,
        isCanceled: updatedOrder.status === OrderStatus.CANCELED,
        cancellationReason: updatedOrder.cancellationReason || undefined,
      };

      if (!updatedOrder.isPaid) {
        return {
          success: false,
          message: `Order ${id} is not paid, skipping business report`,
        };
      }

      if (updatedOrder.type === OrderType.DELIVERY) {
        if (updatedOrder.status === OrderStatus.DONE) {
          return updatedOrder;
        }

        if (updatedOrder.status === OrderStatus.DELIVERED) {
          orderRelatory = {
            ...orderRelatory,
            timeToDelivery: Math.round(
              (new Date().getTime() -
                updatedOrder.finishedPreparing.getTime()) /
                60000,
            ),
          };
        }
      }

      await this.businessRepository.create(orderRelatory);
    }

    return updatedOrder;
  }

  async confirmPayment(id: string): Promise<Order | OrderReturn> {
    const updatedOrder = await this.orderRepository.confirmPayment(id);

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return updatedOrder;
  }

  async startPreparing(id: string): Promise<Order | OrderReturn> {
    const startPreparing = new Date();

    const updatedOrder = await this.orderRepository.startPreparing(
      id,
      startPreparing,
    );

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return updatedOrder;
  }

  async finishPreparing(id: string): Promise<Order | OrderReturn> {
    const finishPreparing = new Date();

    const updatedOrder = await this.orderRepository.finishPreparing(
      id,
      finishPreparing,
    );

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

    return updatedOrder;
  }

  async setTransactionHandler(waiterId: string, orderId: string) {
    const waiter = await this.workerRepository.findOne(waiterId);

    if (!waiter)
      return {
        success: false,
        message: `Worker with id ${waiterId} not found.`,
      };

    const waiterName = waiter.displayName;

    const updatedOrder = await this.orderRepository.setTransactionHandler(
      waiterId,
      waiterName,
      orderId,
    );

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${orderId} not found.`,
      };

    return updatedOrder;
  }
}
