import { Order } from "../../../order/order.schema";

export interface OrderReturn {
  success: boolean;
  message: string;
  order?: Order;
}
