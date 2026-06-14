import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCurrency } from '@/lib/format-currency';
import type { ShopItem } from '@/types/shop';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ItemCardProps = {
  item: ShopItem;
  onPress: () => void;
};

export function ItemCard({ item, onPress }: ItemCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <ThemedView type="backgroundElement" style={styles.inner}>
        <ThemedText type="smallBold" numberOfLines={2} style={styles.name}>
          {item.name}
        </ThemedText>
        <ThemedText style={[styles.price, { color: theme.accent }]}>
          {formatCurrency(item.price)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    maxWidth: '50%',
  },
  inner: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    minHeight: 88,
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
