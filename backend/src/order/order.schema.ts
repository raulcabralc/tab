import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { OrderType } from "./types/enums/type.enum";
import { OrderPriority } from "./types/enums/priority.enum";
import { OrderStatus } from "./types/enums/status.enum";
import { PaymentMethod } from "./types/enums/payment-method.enum";
import { Origin } from "./types/enums/origin.enum";
import type { OrderItem } from "./types/interfaces/item.interface";
import type { Address } from "./types/interfaces/address.interface";
import mongoose from "mongoose";

@Schema()
export class Order {
  // Prioridade do pedido
  @Prop({ required: true })
  priority: OrderPriority;

  // Número na ordem do pedido
  @Prop({ required: true })
  number: number;

  // Status do pedido
  @Prop({ required: true })
  status: OrderStatus;

  @Prop({ required: false })
  cancellationReason?: string;

  // Hora que o pedido foi feito
  @Prop({ required: true })
  ordered: Date;

  // Itens do pedido
  @Prop({ required: true, type: Object })
  items: OrderItem[];

  // Para onde o pedido vai
  @Prop({ required: true })
  type: OrderType;

  // Número da mesa
  @Prop({ required: false })
  tableNumber: number;

  // Endereço para entrega
  @Prop({ required: false, type: Object })
  address: Address;

  // Garçom que fez o pedido
  @Prop({ required: true })
  waiterId: string;

  @Prop({ required: true })
  waiterName: string;

  // Garçom que fechou a conta
  @Prop({ required: false })
  transactionHandlerId?: string;

  @Prop({ required: false })
  transactionHandlerName?: string;

  /// FINANCEIRO

  // Subtotal do pedido
  @Prop({ required: true })
  subtotal: number;

  // Desconto do pedido
  @Prop({ required: true })
  discount: number;

  // Taxa de entrega
  @Prop({ required: true })
  deliveryFee: number;

  // Valor total do pedido
  @Prop({ required: true })
  total: number;

  // Valor dado pelo cliente
  @Prop({ required: true })
  amountPaid: number;

  // Troco
  @Prop({ required: true })
  change: number;

  // Método de pagamento
  @Prop({ required: true })
  paymentMethod: PaymentMethod;

  // Se já está pago
  @Prop({ required: true })
  isPaid: boolean;

  /// BUSINESS INTELIGENCE

  // Começou a preparar
  @Prop({ required: false })
  startedPreparing: Date;

  // Pedido ficou pronto
  @Prop({ required: false })
  finishedPreparing: Date;

  // Origem do pedido
  @Prop({ required: true })
  origin: Origin;

  @Prop({ required: false })
  customerCount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  restaurantId: mongoose.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
