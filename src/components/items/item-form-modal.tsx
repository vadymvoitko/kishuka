import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { ShopItem } from '@/types/shop';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ItemFormModalProps = {
  visible: boolean;
  item?: ShopItem;
  onClose: () => void;
  onSave: (values: { name: string; price: number }) => void;
};

export function ItemFormModal({ visible, item, onClose, onSave }: ItemFormModalProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setName(item?.name ?? '');
      setPrice(item ? String(item.price) : '');
      setError('');
    }
  }, [visible, item]);

  function handleSave() {
    const trimmedName = name.trim();
    const parsedPrice = Number(price.replace(/,/g, ''));

    if (!trimmedName) {
      setError('Enter an item name');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError('Enter a valid price');
      return;
    }

    onSave({ name: trimmedName, price: Math.round(parsedPrice) });
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <ThemedView style={styles.sheet}>
          <ThemedText type="subtitle" style={styles.title}>
            {item ? 'Kuhariri bidhaa' : 'Ongeza bidhaa'}
          </ThemedText>

          <View style={styles.field}>
            <ThemedText type="smallBold">Jina</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="mfano Sukari robo"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <ThemedText type="smallBold">Bei (TZS)</ThemedText>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="mfano 2500"
              placeholderTextColor={theme.textSecondary}
              keyboardType="number-pad"
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </View>

          {error ? (
            <ThemedText type="small" style={{ color: theme.danger }}>
              {error}
            </ThemedText>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <ThemedText type="smallBold">Ghairi</ThemedText>
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                Hifadhi
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000066',
  },
  sheet: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    backgroundColor: '#00000011',
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  pressed: {
    opacity: 0.8,
  },
});
