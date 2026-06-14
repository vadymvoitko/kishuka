import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ItemCard } from '@/components/sell/item-card';
import { CartPanel, ReceiptModal } from '@/components/sell/cart-panel';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useShop } from '@/context/shop-context';
import { formatCurrency } from '@/lib/format-currency';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SellScreen() {
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
    cartTotal,
    cartCount,
  } = useShop();
  const [receiptVisible, setReceiptVisible] = useState(false);

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
            <ThemedText type="subtitle">Kishuka</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Tap items to add to the sale
            </ThemedText>
          </View>
          {cartCount > 0 ? (
            <View style={[styles.badge, { backgroundColor: theme.accentMuted }]}>
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                {cartCount} in cart · {formatCurrency(cartTotal)}
              </ThemedText>
            </View>
          ) : null}
        </View>

        {items.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText type="smallBold">No items yet</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Add the products you sell so you can tap them quickly during checkout.
            </ThemedText>
            <Pressable
              onPress={() => router.push('/items')}
              style={({ pressed }) => [
                styles.cta,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.ctaText}>
                Set up items
              </ThemedText>
            </Pressable>
          </ThemedView>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            renderItem={({ item }) => (
              <ItemCard item={item} onPress={() => addToCart(item)} />
            )}
          />
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
        cart={cart}
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
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
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
