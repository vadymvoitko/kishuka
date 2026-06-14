export type ShopItem = {
  id: string;
  name: string;
  price: number;
};

export type CartLine = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};
