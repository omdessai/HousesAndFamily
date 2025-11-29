# Implement Inventory and Chore Navigation (Edit Mode)

## Goal Description
Enable users to view and edit inventory items and chores by clicking on them in their respective lists. This will reuse `AddItem` and `AddChore` screens as edit/detail screens.

## Proposed Changes

### Data Layer
#### [MODIFY] [src/data/mockStore.ts](file:///Users/ndessai/projects/HousesAndFamily/app/src/data/mockStore.ts)
- Add `updateInventoryItem(id: string, updates: Partial<InventoryItem>)` function.
- Add `updateChore(id: string, updates: Partial<Chore>)` function.

### Screens
#### [MODIFY] [src/screens/AddItem.tsx](file:///Users/ndessai/projects/HousesAndFamily/app/src/screens/AddItem.tsx)
- Accept `item` object in route params.
- Pre-fill form if `item` exists.
- Update title to "Edit Item" if editing.
- Call `mockStore.updateInventoryItem` if editing, otherwise `addInventoryItem`.

#### [MODIFY] [src/screens/AddChore.tsx](file:///Users/ndessai/projects/HousesAndFamily/app/src/screens/AddChore.tsx)
- Accept `chore` object in route params.
- Pre-fill form if `chore` exists.
- Update title to "Edit Chore" if editing.
- Call `mockStore.updateChore` if editing, otherwise `addChore`.

#### [MODIFY] [src/components/InventoryList.tsx](file:///Users/ndessai/projects/HousesAndFamily/app/src/components/InventoryList.tsx)
- Update `onPress` to call a new `onItemPress` prop.

#### [MODIFY] [src/components/ChoreList.tsx](file:///Users/ndessai/projects/HousesAndFamily/app/src/components/ChoreList.tsx)
- Add `onChorePress` prop and use it on card press.

#### [MODIFY] [src/screens/HouseDetails.tsx](file:///Users/ndessai/projects/HousesAndFamily/app/src/screens/HouseDetails.tsx)
- Implement `handleItemPress` to navigate to `AddItem` with the item.
- Implement `handleChorePress` to navigate to `AddChore` with the chore.

### Navigation
#### [MODIFY] [src/navigation/AppNavigator.tsx](file:///Users/ndessai/projects/HousesAndFamily/app/src/navigation/AppNavigator.tsx)
- Update `AddItem` route params type to include optional `item`.
- Update `AddChore` route params type to include optional `chore`.

## Verification Plan
### Manual Verification
- Navigate to House Details -> Inventory Tab.
- Tap an inventory item.
- Verify `AddItem` screen opens with pre-filled data.
- Change details and save.
- Verify changes are reflected in the list.
