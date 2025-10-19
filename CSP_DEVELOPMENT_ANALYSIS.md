# CSP Development Requirements Analysis

## What Breaks Without `unsafe-inline`

### 1. Vue Component Styles

```vue
<template>
  <div class="my-component">Hello</div>
</template>

<style scoped>
.my-component {
  color: red;
}
</style>
```

**Problem**: Vue injects scoped styles like this into the DOM:

```html
<style>
  .my-component[data-v-123456] {
    color: red;
  }
</style>
```

**CSP Violation**: `style-src 'self'` blocks inline styles

### 2. Dynamic Style Binding

```vue
<template>
  <div :style="{ color: dynamicColor }">Dynamic</div>
</template>
```

**Problem**: Vue creates inline style attributes
**CSP Violation**: `style-src 'self'` blocks inline styles

### 3. Vite Development CSS

Vite injects development-specific CSS inline for:

- Error overlays
- HMR indicators
- Development warnings

## What Breaks Without `unsafe-eval`

### 1. Hot Module Replacement

```javascript
// Vite HMR code (simplified)
function updateModule(moduleId, newCode) {
  eval(newCode); // CSP violation without unsafe-eval
}
```

### 2. Dynamic Imports

```javascript
// Vue router dynamic imports
const component = () => import("./Component.vue");
// Requires eval() for dynamic module loading
```

### 3. Vue SFC Compilation

```javascript
// Vue compiles this at runtime:
const compiled = compileTemplate(`
  <div>{{ message }}</div>
`);
// Requires eval() for template compilation
```

### 4. Source Maps

```javascript
// Development source maps often use eval()
eval(sourceMapCode);
```

## Production Alternatives

### Instead of `unsafe-inline`:

```html
<!-- Use nonces -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  style-src 'self' 'nonce-abc123';
"
/>
<style nonce="abc123">
  .my-component {
    color: red;
  }
</style>
```

### Instead of `unsafe-eval`:

```html
<!-- Use hashes for specific scripts -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  script-src 'self' 'sha256-hash-of-specific-script';
"
/>
```

## Why Development is Different

1. **Dynamic Compilation**: Components are compiled on-the-fly
2. **Hot Reloading**: Code is evaluated dynamically
3. **Development Tools**: Source maps, debugging, error overlays
4. **Flexibility**: Developers need to inject code dynamically

## Production Build Process

In production builds:

1. **Styles are extracted** to separate CSS files
2. **Scripts are bundled** into static files
3. **No dynamic evaluation** needed
4. **Nonces/hashes** can be used instead of unsafe-\*

## Current CSP Analysis

Your current CSP:

```html
script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self'
'unsafe-inline';
```

**Development**: ✅ Works with Vue + Vite
**Production**: ⚠️ Less secure, should be tightened

## Recommended Production CSP

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' data:;
  font-src 'self' data:;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
"
/>
```

This works because production builds:

- Bundle all JavaScript into static files
- Extract all CSS into separate files
- Don't require dynamic evaluation
- Don't inject inline styles
