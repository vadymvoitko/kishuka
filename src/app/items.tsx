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
    Alert.alert('Delete item', `Remove "${item.name}" from your shop?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteItem(item.id),
      },
    ]);
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
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="subtitle">Shop items</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Configure what you sell and set prices once
            </ThemedText>
          </View>
          <Pressable
            onPress={openAddModal}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: theme.accent },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={styles.addButtonText}>
              + Add
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
              <ThemedText type="smallBold">No items configured</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                Add products like sugar, soap, or cooking oil with their usual selling price.
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
                    Tap to edit · hold to delete
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
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  addButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    marginTop: 60
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
