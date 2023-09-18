# CSS-in-JS

> **Warning:** CSS-in-JS libraries which require runtime JavaScript are not currently supported in Server Components.
> Using CSS-in-JS with newer React features like Server Components and Streaming requires library authors to support the latest version of React, including [concurrent rendering](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react).
>
> We're working with the React team on upstream APIs to handle CSS and JavaScript assets with support for React Server Components and streaming architecture.

The following libraries are supported in Client Components in the `app` directory (alphabetical):

- [`kuma-ui`](https://kuma-ui.com)
- [`@mui/material`](https://mui.com/material-ui/guides/next-js-app-router/)
- [`pandacss`](https://panda-css.com)
- [`styled-jsx`](#styled-jsx)
- [`styled-components`](#styled-components)
- [`style9`](https://github.com/johanholmerin/style9)
- [`tamagui`](https://tamagui.dev/docs/guides/next-js#server-components)
- [`tss-react`](https://tss-react.dev/)
- [`vanilla-extract`](https://github.com/vercel/next.js/tree/canary/examples/with-vanilla-extract)

The following are currently working on support:

- [`emotion`](https://github.com/emotion-js/emotion/issues/2928)

> **Good to know**: We're testing out different CSS-in-JS libraries and we'll be adding more examples for libraries that support React 18 features and/or the `app` directory.

If you want to style Server Components, we recommend using [CSS Modules](/guide/styling/css-modules) or other solutions that output CSS files, like PostCSS or [Tailwind CSS](/guide/styling/tailwind-css).

## Configuring CSS-in-JS in `app`

Configuring CSS-in-JS is a three-step opt-in process that involves:

1. A **style registry** to collect all CSS rules in a render.
2. The new `useServerInsertedHTML` hook to inject rules before any content that might use them.
3. A Client Component that wraps your app with the style registry during initial server-side rendering.

### `styled-jsx`

Using `styled-jsx` in Client Components requires using `v5.1.0`.
First, create a new registry:

```tsx
// filename="app/registry.tsx"
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
```

Then, wrap your [root layout](/guide/routing/pages-and-layouts#root-layout-required) with the registry:

```tsx
// filename="app/layout.tsx"
import StyledJsxRegistry from './registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
```

[View an example here](https://github.com/vercel/app-playground/tree/main/app/styling/styled-jsx).

### Styled Components

Below is an example of how to configure `styled-components@6` or newer:

First, use the `styled-components` API to create a global registry component to collect all CSS style rules generated during a render, and a function to return those rules.
Then use the `useServerInsertedHTML` hook to inject the styles collected in the registry into the `<head>` HTML tag in the root layout.

```tsx
// filename="lib/registry.tsx"
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
```

Wrap the `children` of the root layout with the style registry component:

```tsx
// filename="app/layout.tsx"
import StyledComponentsRegistry from './lib/registry';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

[View an example here](https://github.com/vercel/app-playground/tree/main/app/styling/styled-components).

> **Good to know**:
>
> - During server rendering, styles will be extracted to a global registry and flushed to the `<head>` of your HTML.
>   This ensures the style rules are placed before any content that might use them.
>   In the future, we may use an upcoming React feature to determine where to inject the styles.
> - During streaming, styles from each chunk will be collected and appended to existing styles.
>   After client-side hydration is complete, `styled-components` will take over as usual and inject any further dynamic styles.
> - We specifically use a Client Component at the top level of the tree for the style registry because it's more efficient to extract CSS rules this way.
>   It avoids re-generating styles on subsequent server renders, and prevents them from being sent in the Server Component payload.
