import type { Address } from "../interfaces/address.interface";
import { Origin } from "../enums/origin.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { OrderType } from "../enums/type.enum";
import { OrderItem } from "../interfaces/item.interface";
import { OrderPriority } from "../enums/priority.enum";
import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateOrderDto {
  @IsString()
  priority: OrderPriority;

  @IsNumber()
  number: number;

  @IsArray()
  items: OrderItem[];

  @IsString()
  type: OrderType;

  @IsOptional()
  @IsNumber()
  tableNumber?: number;

  @IsOptional()
  @IsObject()
  address?: Address;

  @IsString()
  waiterId: string;

  @IsString()
  waiterName: string;

  @IsOptional()
  @IsString()
  transactionHandlerId?: string;

  @IsOptional()
  @IsString()
  transactionHandlerName?: string;

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

  @IsString()
  paymentMethod: PaymentMethod;

  @IsString()
  origin: Origin;

  @IsOptional()
  @IsNumber()
  customerCount?: number;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
