import { Order } from "../../../order/order.schema";
import { CreateOrderDto } from "../../../order/types/dto/create-order.dto";
import { OrderPriority } from "../../../order/types/enums/priority.enum";

export interface NotificationData {
  orderId?: string;
  orderData?: Order | CreateOrderDto;
  message?: string;
  priority?: OrderPriority;
}
