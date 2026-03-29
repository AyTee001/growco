export interface BasketItemModel {
    id: number | string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    weight: number;
    discount?: number;
  }