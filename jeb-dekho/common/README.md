# Jeb Dekho - Common Module

Shared libraries, types, and utilities used across all applications in the Jeb Dekho monorepo.

## Contents

- **Types**: Shared TypeScript interfaces and types
- **Utilities**: Common helper functions
- **Constants**: Shared configuration and constants
- **Theme**: Brand colors and design tokens

## Usage

Import shared resources in any app:

```typescript
import { UserType, OrderStatus } from '@jeb-dekho/common';
```

## Structure

```
common/
├── src/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── theme/
└── index.ts
```