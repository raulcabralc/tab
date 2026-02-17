import { ItemCategory } from "../../../order/types/enums/item-category.enum";

export interface TopItems {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  totalQuantitySold: number;
}
