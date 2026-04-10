# CyberWiki Screenset

Main screenset for the CyberWiki application, consolidating repository browsing, document viewing, and system configuration.

## Structure

```
cyberwiki/
├── screens/
│   ├── repository-selection/    # Browse and select repositories
│   ├── repository-view/          # View repository files and documents
│   ├── repository-configuration/ # Configure document index settings
│   └── configuration/            # Git provider credentials configuration
├── slices/
│   ├── repositorySettingsSlice.ts  # Repository settings state
│   └── serviceTokenSlice.ts        # Service token state
├── actions/
│   └── repositorySettingsActions.ts # Repository settings actions
├── effects/
│   └── repositorySettingsEffects.ts # Repository settings effects
├── events/
│   └── repositorySettingsEvents.ts  # Repository settings events
├── utils/
│   ├── api.ts                    # API integration layer
│   └── serviceTokenHelper.ts     # Service token hooks
├── types/
│   ├── index.ts                  # Repository domain types
│   └── serviceTokenTypes.ts      # Service token types
├── i18n/
│   └── en.json                   # English translations
├── ids.ts                        # Screenset and screen IDs
├── cyberWikiScreenset.tsx        # Main screenset configuration
└── README.md                     # This file
```

## Screens

### 1. Repository Selection
**ID**: `repository-selection`
**Icon**: `lucide:folder-git`
**Purpose**: Browse and select repositories from configured git providers

**Features**:
- Repository listing from git provider API
- Search and filtering
- Tab-based navigation (All/Favorite/Recent)
- Integration with service tokens

### 2. Repository View
**ID**: `repository-view`
**Icon**: `lucide:file-text`
**Purpose**: View repository files and documents with dual-mode navigation

**Features**:
- File tree navigation
- Document/Developer view mode toggle
- File content viewer
- View mode persistence

### 3. Repository Configuration
**ID**: `repository-configuration`
**Icon**: `lucide:settings`
**Purpose**: Configure document index settings per repository

**Features**:
- Document index configuration
- Included extensions management
- Excluded paths configuration
- Title extraction strategy selection

### 4. Configuration
**ID**: `configuration`
**Icon**: `lucide:cog`
**Purpose**: Configure git provider credentials and system settings

**Features**:
- Service token management
- Git provider configuration (GitHub, Bitbucket)
- Credential storage and validation

## State Management

### Repository Settings Slice
Manages repository-specific settings including:
- Current repository context
- Document index configuration
- View mode preferences
- Branch selection

### Service Token Slice
Manages git provider credentials:
- Service tokens for GitHub, Bitbucket, etc.
- Provider selection
- Token validation

## API Integration

All API calls go through the unified API layer in `utils/api.ts`:
- Repository listing
- Tree navigation
- File content fetching
- Settings persistence

## Migration from Repositories Screenset

This screenset consolidates functionality from:
1. **repositories/** screenset - Repository browsing and viewing
2. **demo/screens/service-tokens/** - Configuration screen

All functionality has been moved to this unified screenset for better organization.

## Usage

The screenset is auto-discovered and registered via Vite glob pattern matching. No manual imports needed.

To access screens:
```typescript
// Navigate to repository selection
navigate({ screensetId: 'cyberwiki', screenId: 'repository-selection' });

// Navigate to configuration
navigate({ screensetId: 'cyberwiki', screenId: 'configuration' });
```

## Next Steps

1. ✅ Screenset created and registered
2. ⏳ Update import paths in copied files
3. ⏳ Test all screens load correctly
4. ⏳ Remove old repositories screenset
5. ⏳ Update documentation references
