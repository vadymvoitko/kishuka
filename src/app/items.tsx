import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemFormModal } from '@/components/items/item-form-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useShop } from '@/context/shop-context';
import { formatCurrency } from '@/lib/format-currency';
import type { ShopItem } from '@/types/shop';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ItemsScreen() {
  const theme = useTheme();
  const { items, isLoading, addItem, updateItem, deleteItem } = useShop();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | undefined>();

  function openAddModal() {
    setEditingItem(undefined);
    setModalVisible(true);
  }

  function openEditModal(item: ShopItem) {
    setEditingItem(item);
    setModalVisible(true);
  }

  function confirmDelete(item: ShopItem) {
    deleteItem(item.id);
  }

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
        <ThemedText style={{
          textAlign: 'center',
          fontSize: 22,
          color: theme.accent,
          fontWeight: 600,
          marginTop: 12
        }}>
          Ongeza bidhaa unazouza
        </ThemedText>
        <View style={styles.header}>
          <Pressable
            onPress={openAddModal}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: theme.accent },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={styles.addButtonText}>
              + Ongeza
            </ThemedText>
          </Pressable>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            items.length === 0 && styles.listEmpty,
          ]}
          ListEmptyComponent={
            <ThemedView style={styles.emptyState}>
              <ThemedText type="smallBold">Hakuna bidhaa</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Ongeza bidhaa kama sukari, sabuni, au mafuta ya kupikia pamoja na bei yake ya kawaida ya kuuza.
              </ThemedText>
            </ThemedView>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => openEditModal(item)}
              onLongPress={() => confirmDelete(item)}
              style={({ pressed }) => [styles.itemRow, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <ThemedText type="smallBold">{item.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Gusa ili kuhariri, bonyeza kwa muda ili kufuta
                  </ThemedText>
                </View>
                <ThemedText type="smallBold" style={{ color: theme.accent }}>
                  {formatCurrency(item.price)}
                </ThemedText>
              </ThemedView>
            </Pressable>
          )}
        />
      </SafeAreaView>

      <ItemFormModal
        visible={modalVisible}
        item={editingItem}
        onClose={() => setModalVisible(false)}
        onSave={async (values) => {
          if (editingItem) {
            await updateItem({ ...editingItem, ...values });
          } else {
            await addItem(values);
          }
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
    paddingBottom: BottomTabInset,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  addButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    marginTop: 0
  },
  addButtonText: {
    color: '#ffffff'
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  listEmpty: {
    flexGrow: 1,
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
  itemRow: {
    borderRadius: Spacing.three,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
