import { Address } from "../interfaces/address.interface";
import { Origin } from "../enums/origin.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { OrderType } from "../enums/type.enum";
import { OrderItem } from "../interfaces/item.interface";
import { OrderPriority } from "../enums/priority.enum";
import { OrderStatus } from "../enums/status.enum";
import {
  IsBoolean,
  IsDate,
  isNumber,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateOrderDto {
  @IsString()
  id?: string;

  @IsString()
  priority: OrderPriority;

  @IsNumber()
  number: number;

  @IsString()
  status?: OrderStatus;

  @IsDate()
  ordered: Date;

  items: OrderItem[];

  @IsString()
  type: OrderType;

  @IsNumber()
  tableNumber?: number;

  address?: Address;

  @IsString()
  waiterId: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  deliveryFee: number;

  @IsNumber()
  total: number;

  @IsNumber()
  amountPaid: number;

  @IsNumber()
  change?: number;

  @IsString()
  paymentMethod: PaymentMethod;

  @IsBoolean()
  isPaid?: boolean;

  @IsDate()
  startedPreparing?: Date | null;

  @IsDate()
  finishedPreparing?: Date | null;

  @IsString()
  origin: Origin;
}
