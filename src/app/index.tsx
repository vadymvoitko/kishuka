import {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useFocusEffect, useRouter} from 'expo-router';

import { ItemCard } from '@/components/sell/item-card';
import { CartPanel, ReceiptModal } from '@/components/sell/cart-panel';
import { CartPanelMain } from '@/components/sell/cart-panel-main';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useShop } from '@/context/shop-context';
import { formatCurrency } from '@/lib/format-currency';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type {CartLine} from "../types/shop";

export default function SellScreen() {
  const [cartItems, setCart] = useState<CartLine[]>([]);
  const cartTotal = useMemo(
      () => cartItems.reduce((sum, line) => sum + line.price * line.quantity, 0),
      [cartItems],
  );
  const router = useRouter();
  const theme = useTheme();
  const {
    items,
    cart,
    isLoading,
    addToCart,
    decrementCartLine,
    removeCartLine,
    clearCart,
    // cartTotal,
    cartCount,
  } = useShop();
  const [receiptVisible, setReceiptVisible] = useState(false);

  useFocusEffect(
      useCallback(() => {
        setCart(items.map(el => {
          const obj = cart.find(e => e.itemId === el.id) || {};
          return {
            ...el,
            itemId: el.id,
            quantity: typeof obj.quantity !== 'undefined' ? obj.quantity : 0
          }
        }))
        return () => ({});
      }, [items, cart])
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.accent} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <ThemedText style={{
              textAlign: 'center',
              fontSize: '22px',
              color: theme.accent,
              fontWeight: 600
            }}>
              Chagua bidhaa unazouza
            </ThemedText>
          </View>
          {/*{cartCount > 0 ? (*/}
          {/*  <View style={[styles.badge, { backgroundColor: theme.accentMuted }]}>*/}
          {/*    <ThemedText type="smallBold" style={{ color: theme.accent }}>*/}
          {/*      {cartCount} in cart · {formatCurrency(cartTotal)}*/}
          {/*    </ThemedText>*/}
          {/*  </View>*/}
          {/*) : null}*/}
        </View>

        {items.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="smallBold">No items yet</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Ongeza bidhaa unazouza ili uweze kuzigusa haraka wakati wa malipo.
            </ThemedText>
            <Pressable
              onPress={() => router.push('/items')}
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.ctaText}>
                Weka bidhaa
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
            <View>
              <CartPanelMain
                  cart={cartItems}
                  total={cartTotal}
                  onIncrement={(itemId) => {
                    const item = items.find((entry) => entry.id === itemId);
                    if (item) {
                      addToCart(item);
                    }
                  }}
                  onDecrement={decrementCartLine}
              />
            </View>
        )}
      </SafeAreaView>

      <View style={{ paddingBottom: BottomTabInset }}>
        <CartPanel
          cart={cart}
          total={cartTotal}
          onIncrement={(itemId) => {
            const item = items.find((entry) => entry.id === itemId);
            if (item) {
              addToCart(item);
            }
          }}
          onDecrement={decrementCartLine}
          onRemove={removeCartLine}
          onShowReceipt={() => setReceiptVisible(true)}
          onNewSale={clearCart}
        />
      </View>

      <ReceiptModal
        visible={receiptVisible}
        cart={cartItems}
        total={cartTotal}
        onClose={() => setReceiptVisible(false)}
        onComplete={() => {
          clearCart();
          setReceiptVisible(false);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.four,
    marginTop: Spacing.two,
    gap: Spacing.two
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
  },
  gridContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  gridRow: {
    gap: Spacing.two,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
    gap: Spacing.two,
  },
  emptyText: {
    textAlign: 'center',
  },
  cta: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  ctaText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.85,
  },
});
