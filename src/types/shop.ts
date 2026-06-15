export type ShopItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartLine = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

// TODO: in index.tsx in flat list display new component which contains commented in cart-panel code. To displau number of tiems - should eiter patth shop list number or do own in items .
