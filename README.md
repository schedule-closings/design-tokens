# @schedule-closings/design-tokens

Shared Schedule Closings design tokens and theme sourced from `schedule-closings/scplayground`.

This package is the production distribution surface for Playground-authored design-system tokens. Frontend applications should consume this package instead of declaring their own design tokens.

## Contents

- Token scales from Playground `app/lib/tokens`
- `createAppTheme(mode)` and default light `theme`
- `ColorModeProvider`, `useColorMode`, and `ColorModeContext`
- `SmoothBox` and squircle helpers

## Release

The package publishes to GitHub Packages when a `v*` tag is pushed.

```bash
npm ci
npm run build
git tag v0.1.0
git push origin v0.1.0
```

## Source Of Truth

Mat authors token changes in `schedule-closings/scplayground`. This repo mirrors those changes and publishes versioned releases for production consumers.
