import { ItemCategory } from "../enums/item-category.enum";

export interface OrderItem {
  itemId: number;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  ingredients: string[];
  observation?: string;
}
