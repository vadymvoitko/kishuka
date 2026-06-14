import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ShopItem } from '@/types/shop';

const ITEMS_KEY = '@kishuka/items';

export async function loadItems(): Promise<ShopItem[]> {
  const raw = await AsyncStorage.getItem(ITEMS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as ShopItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveItems(items: ShopItem[]) {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}
