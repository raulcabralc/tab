import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Address } from "./types/interface/address.interface";
import { OpeningHours } from "./types/interface/opening-hours.interface";
import { MenuItem } from "./types/interface/menu-item.interface";

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: false })
  creatorId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object, required: true })
  address: Address;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [Object], required: false })
  cuisines: string[];

  @Prop({ type: [Object], required: false })
  openingHours: OpeningHours[];

  @Prop({ required: false })
  totalTables: number;

  @Prop({ type: [Object], required: false })
  menu: MenuItem[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

export type RestaurantDocument = Restaurant & {
  _id: string;
};
