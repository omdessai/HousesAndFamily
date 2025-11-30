# Local Storage Recommendation

## Recommended Solution: Watermelon DB

### Why Watermelon DB?

**Data Structure Fit**
- Relational data with clear relationships
- Houses → Inventory Items (one-to-many)
- Houses → Chores (one-to-many)
- People → Chores (one-to-many via assignedToId)
- Complex queries needed (filtering, searching, favorites)

**Performance Benefits**
- Lazy loading: Only loads data when needed
- Observable queries: Automatically updates UI when data changes
- Optimized for large datasets: Handles thousands of items without lag
- Built on SQLite: Native performance on iOS and Android

**Developer Experience**
- Type-safe with full TypeScript support
- React integration with built-in hooks (`useDatabase`, `withObservables`)
- Easy schema migrations as app evolves
- Built-in sync engine for future backend integration

### Implementation Example

```typescript
// models/House.ts
import { Model } from '@nozbe/watermelondb'
import { field, children, readonly, date } from '@nozbe/watermelondb/decorators'

export default class House extends Model {
  static table = 'houses'
  static associations = {
    inventory_items: { type: 'has_many', foreignKey: 'house_id' },
    chores: { type: 'has_many', foreignKey: 'house_id' },
  }

  @field('name') name!: string
  @field('address') address!: string
  @field('is_favorite') isFavorite!: boolean
  @field('interest') interest!: string
  @field('residence_type') residenceType!: string
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @children('inventory_items') inventoryItems!: Query<InventoryItem>
  @children('chores') chores!: Query<Chore>
}
```

### Alternative Options Comparison

| Solution | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Watermelon DB** | Relational, Fast, Sync-ready, Observable | Learning curve | ⭐ **Best Choice** |
| **AsyncStorage** | Simple, Built-in | No relations, Slow, 6MB limit | ❌ Too limited |
| **MMKV** | Fastest key-value store | No relations, Manual serialization | ⚠️ Only if data stays simple |
| **Realm** | Powerful, Fast | Large bundle (2MB+), Complex setup | ⚠️ Overkill |
| **SQLite (raw)** | Full control | Manual queries, No reactivity | ⚠️ Too much boilerplate |

### Migration Path from mockStore

1. **Install Watermelon DB**
   ```bash
   npm install @nozbe/watermelondb
   npx watermelondb-cli setup
   ```

2. **Define Schema** (similar to current types)

3. **Create Models** (one for each entity: House, Person, InventoryItem, Chore)

4. **Update Hooks** (replace mockStore calls with Watermelon queries)

5. **Migrate Data** (optional: import existing mock data)

### When to Use Alternatives

- **MMKV**: If data stays very simple (just settings, no relations)
- **Realm**: If you need advanced features like encryption or complex aggregations
- **AsyncStorage**: Only for simple app preferences (theme, onboarding status)

### Recommendation Summary

**Use Watermelon DB** because:
1. Data is relational (houses, items, chores, people)
2. Complex queries needed (filter by house, search, favorites)
3. Performance matters (potentially hundreds of items per house)
4. Future-proof for backend sync
5. Excellent React Native integration with observable queries
