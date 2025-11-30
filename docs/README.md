# HousesAndFamily Documentation

This directory contains documentation for the HousesAndFamily project.

## Contents

- **[product_requirements.md](./product_requirements.md)** - Product requirements and feature specifications for the mobile app
- **[future_implementation_plan.md](./future_implementation_plan.md)** - Planned features and future enhancements (House entity, etc.)
- **[fast_refresh_troubleshooting.md](./fast_refresh_troubleshooting.md)** - Troubleshooting guide for React Native Fast Refresh issues

## Project Overview

HousesAndFamily is a React Native mobile application for managing household inventory, family members, and chores across multiple properties.

### Key Technologies

- **React Native 0.82.1** - Mobile framework
- **React Navigation** - Navigation
- **React Native Paper** - UI components  
- **WatermelonDB** - Local database
- **TypeScript** - Type safety

### Project Structure

```
HousesAndFamily/
├── app/                    # React Native application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── screens/        # Screen components
│   │   ├── navigation/     # Navigation configuration
│   │   ├── storage/        # WatermelonDB models and repositories
│   │   └── theme/          # Theme configuration
│   ├── android/            # Android native code
│   └── ios/                # iOS native code
└── docs/                   # Documentation (this folder)
```

## Getting Started

See the main README in the `app/` directory for setup instructions.
