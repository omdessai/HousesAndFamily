# Future Implementation Plan

This document outlines the roadmap for future enhancements and system integrations for the House Inventory & Maintenance System.

## 1. Backend Integration
Currently, the app uses a local mock store. To support data persistence, synchronization across devices, and multi-user collaboration, a backend integration is essential.

### Options:
- **Firebase (Recommended for speed):**
  - **Firestore:** NoSQL database for flexible data structure.
  - **Authentication:** Easy integration for user login (Email, Google, Apple).
  - **Storage:** Store images (house photos, receipts).
- **Supabase (Open Source Alternative):**
  - **PostgreSQL:** Relational database with strong typing.
  - **Auth & Storage:** Similar features to Firebase.
- **Custom GraphQL API:**
  - **Node.js + Apollo Server:** Full control over API logic.
  - **Prisma:** ORM for database interaction.

### Action Items:
- [ ] Choose a backend provider.
- [ ] Design database schema (Houses, People, Inventory, Chores).
- [ ] Implement authentication flow.
- [ ] Replace `mockStore` with API calls.

## 2. Camera Integration & Barcode Scanning
To streamline inventory management, integrating camera functionality is crucial.

### Features:
- **Barcode Scanning:** Automatically fill item details (Model, Brand) by scanning barcodes.
- **Receipt Capture:** Snap photos of receipts for warranty tracking.
- **Item Photos:** Add visual records of inventory items.

### Libraries:
- `react-native-vision-camera`: High performance, modern API.
- `react-native-camera-kit`: Simpler, specific for scanning.

### Action Items:
- [ ] Integrate camera library.
- [ ] Implement barcode scanning logic in `ItemFormScreen`.
- [ ] Add photo attachment capability to `ItemFormScreen` and `HouseFormScreen`.

## 3. Push Notifications
Remind users of upcoming chores and warranty expirations.

### Features:
- **Chore Reminders:** "Trash pickup tomorrow", "Change air filter".
- **Warranty Alerts:** "Warranty for Refrigerator expires in 30 days".

### Libraries:
- `react-native-push-notification`: Local notifications.
- `firebase-messaging`: Remote notifications (if using Firebase).

### Action Items:
- [ ] Configure notification permissions.
- [ ] Schedule local notifications based on chore due dates.
- [ ] Implement deep linking to open specific chore/item from notification.

## 4. Advanced State Management
As the app grows, `React Query` (TanStack Query) combined with a lightweight global store (Zustand) is recommended.

### Action Items:
- [ ] Migrate `useHouses` and other hooks to `TanStack Query` for caching and background updates.
- [ ] Use `Zustand` for UI state (e.g., filters, sort order).

## 5. CI/CD Pipeline
Automate testing and deployment.

### Tools:
- **GitHub Actions:** Run linting and tests on PRs.
- **Bitrise / EAS Build:** Automate builds for iOS and Android.

### Action Items:
- [ ] Set up GitHub Actions workflow for `eslint` and `jest`.
- [ ] Configure EAS Build for automated app binaries.

## 6. Analytics
Track user behavior to improve the app.

### Tools:
- **Firebase Analytics:** Free, easy integration.
- **PostHog:** Open source, privacy-focused.

### Action Items:
- [ ] Integrate analytics SDK.
- [ ] Track key events (Add House, Complete Chore, Scan Item).
