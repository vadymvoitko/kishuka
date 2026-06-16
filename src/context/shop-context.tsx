import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { loadItems, saveItems } from '@/lib/storage';
import type { CartLine, ShopItem } from '@/types/shop';

type ShopContextValue = {
  items: ShopItem[];
  cart: CartLine[];
  isLoading: boolean;
  addItem: (item: Omit<ShopItem, 'id'>) => Promise<void>;
  updateItem: (item: ShopItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addToCart: (item: ShopItem) => void;
  decrementCartLine: (itemId: string) => void;
  removeCartLine: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems()
      .then((arg) => {
        setItems(arg);
        setCart(arg.map(el => ({
          itemId: el.id,
          name: el.name,
          price: el.price,
          quantity: 0,
        })));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistItems = useCallback(async (nextItems: ShopItem[]) => {
    setItems(nextItems);
    await saveItems(nextItems);
  }, []);

  const addItem = useCallback(
    async (item: Omit<ShopItem, 'id'>) => {
      console.log(items);
      const nextItem: ShopItem = { ...item, id: createId() };
      await persistItems([...items, nextItem]);
    },
    [items, persistItems],
  );

  const updateItem = useCallback(
    async (item: ShopItem) => {
      await persistItems(items.map((existing) => (existing.id === item.id ? item : existing)));
    },
    [items, persistItems],
  );

  const deleteItem = useCallback(
    async (id: string) => {
      await persistItems(items.filter((item) => item.id !== id));
      setCart((current) => current.filter((line) => line.itemId !== id));
    },
    [items, persistItems],
  );

  const addToCart = useCallback((item: ShopItem) => {
    setCart((current) => {
      const existing = current.find((line) => line.itemId === item.id);
      if (existing) {
        return current.map((line) =>
          line.itemId === item.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }

      return [
        ...current,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const decrementCartLine = useCallback((itemId: string) => {
    setCart((current) =>
      current
        .map((line) =>
          line.itemId === itemId ? { ...line, quantity: !!line.quantity ? line.quantity - 1 : 0 } : line,
        )
        // .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeCartLine = useCallback((itemId: string) => {
    setCart((current) => current.filter((line) => line.itemId !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      items,
      cart,
      isLoading,
      addItem,
      updateItem,
      deleteItem,
      addToCart,
      decrementCartLine,
      removeCartLine,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [
      items,
      cart,
      isLoading,
      addItem,
      updateItem,
      deleteItem,
      addToCart,
      decrementCartLine,
      removeCartLine,
      clearCart,
      cartTotal,
      cartCount,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
