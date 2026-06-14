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

export function CartPanel({
  cart,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onShowReceipt,
  onNewSale,
}: CartPanelProps) {
  const theme = useTheme();

  if (cart.length === 0) {
    return (
      <ThemedView type="backgroundElement" style={styles.emptyPanel}>
        <ThemedText themeColor="textSecondary">Tap items above to start a sale</ThemedText>
      </ThemedView>
    );
  }

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
                {formatCurrency(line.price)} each
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
                  Remove
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <ThemedText type="subtitle">Total</ThemedText>
          <ThemedText type="subtitle" style={{ color: theme.accent }}>
            {formatCurrency(total)}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onNewSale}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
            <ThemedText type="smallBold">New sale</ThemedText>
          </Pressable>
          <Pressable
            onPress={onShowReceipt}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.accent },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={styles.primaryButtonText}>
              Receipt
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

type ReceiptModalProps = {
  visible: boolean;
  cart: CartLine[];
  total: number;
  onClose: () => void;
  onComplete: () => void;
};

export function ReceiptModal({ visible, cart, total, onClose, onComplete }: ReceiptModalProps) {
  const theme = useTheme();
  const now = new Date();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="subtitle" style={styles.receiptTitle}>
            Receipt
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.receiptDate}>
            {now.toLocaleString('sw-TZ')}
          </ThemedText>

          <FlatList
            data={cart}
            keyExtractor={(line) => line.itemId}
            style={styles.receiptList}
            renderItem={({ item }) => (
              <View style={styles.receiptLine}>
                <ThemedText style={styles.receiptItemName}>
                  {item.quantity} × {item.name}
                </ThemedText>
                <ThemedText type="smallBold">{formatCurrency(item.price * item.quantity)}</ThemedText>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <View style={styles.receiptTotal}>
            <ThemedText type="subtitle">Total to pay</ThemedText>
            <ThemedText type="subtitle" style={{ color: theme.accent }}>
              {formatCurrency(total)}
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Back</ThemedText>
            </Pressable>
            <Pressable
              onPress={onComplete}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                Done — new sale
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  emptyPanel: {
    padding: Spacing.four,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    alignItems: 'center',
  },
  panel: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingTop: Spacing.three,
    maxHeight: '45%',
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
