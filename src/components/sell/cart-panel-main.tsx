import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCurrency } from '@/lib/format-currency';
import type { CartLine } from '@/types/shop';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CartPanelProps = {
  cart: CartLine[];
  total: number;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onShowReceipt: () => void;
  onNewSale: () => void;
};

export function CartPanelMain({
  cart,
  onIncrement,
  onDecrement,
  onRemove,
}: CartPanelProps) {
  const theme = useTheme();

  return (
    <ThemedView type="backgroundElement" style={styles.panel}>
      <ScrollView style={styles.lines} nestedScrollEnabled>
        {cart.map((line) => (
          <View key={line.itemId} style={styles.line}>
            <View style={styles.lineInfo}>
              <ThemedText type="smallBold" numberOfLines={1}>
                {line.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {formatCurrency(line.price)} kila
              </ThemedText>
            </View>

            <View style={styles.qtyControls}>
              <Pressable
                onPress={() => onDecrement(line.itemId)}
                style={({ pressed }) => [styles.qtyButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold">−</ThemedText>
              </Pressable>
              <ThemedText type="smallBold" style={styles.qty}>
                {line.quantity}
              </ThemedText>
              <Pressable
                onPress={() => onIncrement(line.itemId)}
                style={({ pressed }) => [styles.qtyButton, pressed && styles.pressed]}>
                <ThemedText type="smallBold">+</ThemedText>
              </Pressable>
            </View>

            <View style={styles.lineTotal}>
              <ThemedText type="smallBold">{formatCurrency(line.price * line.quantity)}</ThemedText>
              <Pressable onPress={() => onRemove(line.itemId)} hitSlop={8}>
                <ThemedText type="small" style={{ color: theme.danger }}>
                  Futa
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  panel: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingTop: Spacing.one,
    maxHeight: '100%',
    marginBottom: 10
  },
  lines: {
    paddingHorizontal: Spacing.three,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000022',
  },
  lineInfo: {
    flex: 1,
    gap: 2,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000011',
  },
  qty: {
    minWidth: 24,
    textAlign: 'center',
  },
  lineTotal: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 88,
  },
  footer: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: '#00000011',
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    padding: Spacing.four,
    maxHeight: '85%',
  },
  receiptTitle: {
    textAlign: 'center',
  },
  receiptDate: {
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
  receiptList: {
    maxHeight: 280,
  },
  receiptLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  receiptItemName: {
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#00000022',
  },
  receiptTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.three,
    marginTop: Spacing.two,
    borderTopWidth: 2,
    borderTopColor: '#00000022',
  },
});
