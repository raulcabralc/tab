import { ItemCategory } from "../../../order/types/enums/item-category.enum";

export interface ItemsDenormalized {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifications?: string[];
}
