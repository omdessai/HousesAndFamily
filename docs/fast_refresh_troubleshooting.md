# Fast Refresh Troubleshooting Guide

## Issue
Code changes in the app are not automatically refreshing in the simulator. Manual refresh via Metro is required to see changes.

## Common Causes & Solutions

### 1. **Class Components in Model Files**
**Issue Found:** `Person.ts` uses `export default class` which can interfere with Fast Refresh.

**Status:** This is expected for WatermelonDB models and shouldn't affect component Fast Refresh.

### 2. **Metro Bundler Configuration**
**Current Status:** Using default React Native 0.82.1 metro config - this is correct.

### 3. **Fast Refresh Best Practices**

#### ✅ What Works with Fast Refresh:
- Function components
- Hooks (useState, useEffect, etc.)
- Default exports of components
- Named exports of components

#### ❌ What Breaks Fast Refresh:
- Class components (partial support)
- Higher-order components (HOCs)
- Anonymous default exports
- Syntax errors in any file
- Importing non-component exports from component files

### 4. **Recommended Fixes**

#### Option 1: Enable Fast Refresh Explicitly (Recommended)
Add to `metro.config.js`:

```javascript
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resetCache: true, // Temporary - remove after first run
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

#### Option 2: Check for Syntax Errors
Fast Refresh silently fails if there are ANY syntax errors in the project.

**Action:** Run the linter:
```bash
npm run lint
```

#### Option 3: Restart Metro with Cache Clear
```bash
# Stop Metro
# Then restart with:
npm start -- --reset-cache
```

#### Option 4: Check Simulator Settings
In iOS Simulator:
- Device → Shake (or Cmd+Ctrl+Z)
- Verify "Enable Fast Refresh" is checked

### 5. **Known Limitations**

Fast Refresh will NOT work for:
- Changes to files outside `src/` directory
- Changes to `App.tsx` (requires full reload)
- Changes to native modules
- Changes to `package.json` or config files
- Changes to model classes (WatermelonDB)

### 6. **Debugging Steps**

1. **Check Metro logs** - Look for Fast Refresh messages
2. **Verify no syntax errors** - Run `npm run lint`
3. **Test with a simple component change** - Add a console.log to a screen
4. **Check if specific files are affected** - Some files may have issues
5. **Restart Metro with cache clear** - `npm start -- --reset-cache`

### 7. **Quick Test**

To verify Fast Refresh is working:

1. Open `PersonFormScreen.tsx`
2. Add a `console.log('Test Fast Refresh')` at the top of the component
3. Save the file
4. Check Metro terminal - should see "Fast Refresh" message
5. Check simulator console - should see the log

If you don't see the Fast Refresh message in Metro, the issue is with Metro configuration or a syntax error somewhere.

## Immediate Action Items

1. ✅ Clear Metro cache: `npm start -- --reset-cache`
2. ✅ Run linter to check for errors: `npm run lint`
3. ✅ Update metro.config.js with explicit Fast Refresh settings
4. ✅ Restart the app completely

## Additional Notes

- React Native 0.82.1 has Fast Refresh enabled by default
- The issue is likely a cached state or a syntax error blocking refresh
- WatermelonDB models using classes won't Fast Refresh, but that's expected
- Component files should all Fast Refresh correctly
