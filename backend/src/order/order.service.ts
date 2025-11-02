import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { CreateOrderDto } from "./types/dto/create-order.dto";
import { OrderType } from "./types/enums/type.enum";
import { OrderStatus } from "./types/enums/status.enum";
import { Order } from "./order.schema";
import type { OrderReturn } from "./types/interfaces/return.interface";
import { OrderPriority } from "./types/enums/priority.enum";

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

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
      "priority",
      "number",
      "items",
      "type",
      "waiterId",
      "subtotal",
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

    const itemsFields = ["itemId", "itemName", "quantity"];

    const otherFields = [
      "id",
      "status",
      "ordered",
      "tableName",
      "address",
      "change",
      "isPaid",
      "startPreparing",
      "finishPreparing",
    ];

    for (const field of requiredFields) {
      if (!order[field] && !otherFields.includes(field)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `missing required fields: ${missingFields.join(", ")}`,
      };
    }

    if (!order.tableNumber && !order.address) {
      if (order.type === OrderType.TABLE) {
        return {
          success: false,
          message: "tableNumber is required for table orders.",
        };
      } else {
        return {
          success: false,
          message: "address is required for delivery orders.",
        };
      }
    }

    if (order.address && order.tableNumber) {
      if (order.type === OrderType.TABLE) {
        return {
          success: false,
          message: "address should not be provided for table orders.",
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
        message: `missing required address fields: ${missingAddressFields.join(", ")}`,
      };
    }

    const missingItemsFields: string[] = [];

    if (order.items) {
      for (let item in order.items) {
        for (const field of itemsFields) {
          if (!order.items[item][field]) {
            missingItemsFields.push(field);
          }
        }
      }
    }

    if (missingItemsFields.length > 0) {
      return {
        success: false,
        message: `missing required items fields: ${missingItemsFields.join(", ")}`,
      };
    }

    order = {
      ...order,
      status: OrderStatus.PENDING,
      ordered: new Date(),
      change: parseFloat((order.amountPaid - order.total).toFixed(2)),
      isPaid: false,
      startedPreparing: null,
      finishedPreparing: null,
    };

    return this.orderRepository.createOrder(order);
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
    if (
      (priority !== OrderPriority.HIGH && priority !== OrderPriority.NORMAL) ||
      !this.isValidPriority(priority)
    ) {
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
    if (
      (status !== OrderStatus.PENDING &&
        status !== OrderStatus.PREPARING &&
        status !== OrderStatus.SERVED) ||
      !this.isValidStatus(status)
    ) {
      return {
        success: false,
        message: `Invalid status value: ${status}. Accepted values: PENDING, PREPARING, SERVED.`,
      };
    }

    const updatedOrder = await this.orderRepository.changeStatus(id, status);

    if (!updatedOrder)
      return {
        success: false,
        message: `Order with id ${id} not found.`,
      };

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

  /// TYPE GUARDS

  private isValidPriority(priority: string): priority is OrderPriority {
    return Object.values(OrderPriority).includes(priority as OrderPriority);
  }

  private isValidStatus(status: string): status is OrderStatus {
    return Object.values(OrderStatus).includes(status as OrderStatus);
  }
}
