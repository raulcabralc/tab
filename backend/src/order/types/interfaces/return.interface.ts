import { Order } from "src/order/order.schema";

export interface OrderReturn {
  success: boolean;
  message: string;
  order?: Order;
}
