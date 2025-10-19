# Content Security Policy Configuration

## Development CSP

The current CSP in index.html is configured for development with Vite and Vue.js:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' ws: wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
"
/>
```

## Production CSP (Recommended)

For production builds, consider using a more restrictive CSP:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
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

## CSP Directives Explained

- **default-src 'self'**: Only allow resources from the same origin
- **script-src**: Controls JavaScript execution
  - Development: `'self' 'unsafe-inline' 'unsafe-eval'` (required for Vite HMR)
  - Production: `'self'` (more secure, requires nonce or hash for inline scripts)
- **style-src**: Controls CSS loading
  - `'self' 'unsafe-inline'` (required for Vue component styles)
- **img-src**: Controls image loading
  - `'self' data: blob:` (allows same origin, data URLs, and blob URLs)
- **font-src**: Controls font loading
  - `'self' data:` (allows same origin and data URLs)
- **connect-src**: Controls fetch, XMLHttpRequest, WebSocket connections
  - Development: `'self' ws: wss:` (allows WebSocket for Vite HMR)
  - Production: `'self'` (more restrictive)
- **object-src 'none'**: Blocks all object, embed, and applet elements
- **base-uri 'self'**: Restricts base element to same origin
- **form-action 'self'**: Restricts form submissions to same origin
- **frame-ancestors 'none'**: Prevents embedding in frames/iframes
- **upgrade-insecure-requests**: Automatically upgrades HTTP to HTTPS

## Security Benefits

1. **XSS Protection**: Prevents execution of malicious scripts
2. **Data Injection Prevention**: Blocks unauthorized data sources
3. **Clickjacking Protection**: Prevents embedding in malicious frames
4. **Mixed Content Prevention**: Upgrades insecure requests to HTTPS
5. **Resource Control**: Restricts where resources can be loaded from

## Development Considerations

- The current CSP allows `'unsafe-inline'` and `'unsafe-eval'` for development
- These should be removed or replaced with nonces/hashes in production
- WebSocket connections (`ws: wss:`) are needed for Vite Hot Module Replacement
- Blob URLs are allowed for potential file handling features
