import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Order } from "../order/order.schema";
import { WorkerRole } from "../worker/types/enums/role.enum";
import { NotificationEvent } from "./types/enums/notification-event.enum";
import { NotificationData } from "./types/interfaces/notification-data.interface";
import { CreateOrderDto } from "../order/types/dto/create-order.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, Socket> = new Map<string, Socket>();

  public handleConnection(client: Socket): void {
    console.log(`Connected client: ${client.id}`);
    this.connectedClients.set(client.id, client);
  }

  public handleDisconnect(client: Socket): void {
    console.log(`Disconnected client: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  public notifiyOrderStatusChange(
    orderId: string,
    status: string,
    orderData: Order,
  ): void {
    this.server.emit("orderStatusChange", {
      orderId,
      status,
      orderData,
      timestamp: new Date(),
    });
  }

  public notifyNewOrder(orderData: CreateOrderDto): void {
    this.server.emit("newOrder", {
      orderData,
      timestamp: new Date(),
    });
  }

  public notifyAnalyticsUpdate(data: any): void {
    this.server.emit("analyticsUpdate", {
      data,
      timestamp: new Date(),
    });
  }

  public notifyByRole(
    role: WorkerRole,
    event: NotificationEvent,
    data: NotificationData,
  ): void {
    this.server.emit(`${role}-${event}`, {
      data,
      timestamp: new Date(),
    });
  }
}
