# Forms and Mutations

Forms enable you to create and update data in web applications.
Next.js provides a powerful way to handle form submissions and data mutations using **Server Actions**.

## How Server Actions Work

With Server Actions, you don't need to manually create API endpoints.
Instead, you define asynchronous server functions that can be called directly from your components.

Server Actions can be defined in Server Components or called from Client Components.
Defining the action in a Server Component allows the form to function without JavaScript, providing progressive enhancement.

Enable Server Actions in your `next.config.js` file:

```js
// filename="next.config.js"
module.exports = {
  experimental: {
    serverActions: true,
  },
};
```

> **Good to know:**
>
> - Forms calling Server Actions from Server Components can function without JavaScript.
> - Forms calling Server Actions from Client Components will queue submissions if JavaScript isn't loaded yet, prioritizing client hydration.
> - Server Actions inherit the [runtime](/guide/rendering/edge-and-nodejs-runtimes) from the page or layout they are used on.
> - Currently, if a route uses a Server Action, it is required to [render dynamically](/guide/rendering/server-components#server-rendering-strategies).

## Revalidating Cached Data

Server Actions integrate deeply with the Next.js [caching and revalidation](/guide/building-your-application/caching) architecture.
When a form is submitted, the Server Action can update cached data and revalidate any cache keys that should change.

Rather than being limited to a single form per route like traditional applications, Server Actions enable having multiple actions per route.
Further, the browser does not need to refresh on form submission.
In a single network roundtrip, Next.js can return both the updated UI and the refreshed data.

View the examples below for [revalidating data from Server Actions](#revalidating-data).

## Examples

### Server-only Forms

To create a server-only form, define the Server Action in a Server Component.
The action can either be defined inline with the `"use server"` directive at the top of the function, or in a separate file with the directive at the top of the file.

```tsx
//  filename="app/page.tsx"
export default function Page() {
  async function create(formData: FormData) {
    'use server';

    // mutate data
    // revalidate cache
  }

  return <form action={create}>...</form>;
}
```

> **Good to know**: `<form action={create}>` takes the [FormData](https://developer.mozilla.org/docs/Web/API/FormData/FormData) data type.
> In the example above, the FormData submitted via the HTML [`form`](https://developer.mozilla.org/docs/Web/HTML/Element/form) is accessible in the server action `create`.

### Revalidating Data

Server Actions allow you to invalidate the [Next.js Cache](/guide/building-your-application/caching) on demand.
You can invalidate an entire route segment with [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath):

```ts
// filename="app/actions.ts"
'use server';

import { revalidatePath } from 'next/cache';

export default async function submit() {
  await submitForm();
  revalidatePath('/');
}
```

Or invalidate a specific data fetch with a cache tag using [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag):

```ts
// filename="app/actions.ts"
'use server';

import { revalidateTag } from 'next/cache';

export default async function submit() {
  await addPost();
  revalidateTag('posts');
}
```

### Redirecting

If you would like to redirect the user to a different route after the completion of a Server Action, you can use [`redirect`](/docs/app/api-reference/functions/redirect) and any absolute or relative URL:

```ts
// filename="app/actions.ts"
'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

export default async function submit() {
  const id = await addPost();
  revalidateTag('posts'); // Update cached posts
  redirect(`/post/${id}`); // Navigate to new route
}
```

### Form Validation

We recommend using HTML validation like `required` and `type="email"` for basic form validation.

For more advanced server-side validation, use a schema validation library like [zod](https://zod.dev/) to validate the structure of the parsed form data:

```tsx
// filename="app/actions.ts"
import { z } from 'zod';

const schema = z.object({
  // ...
});

export default async function submit(formData: FormData) {
  const parsed = schema.parse({
    id: formData.get('id'),
  });
  // ...
}
```

### Displaying Loading State

Use the `useFormStatus` hook to show a loading state when a form is submitting on the server:

```tsx
// filename="app/page.tsx"
'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>
  );
}
```

> **Good to know:**
>
> - Displaying loading or error states currently requires using Client Components.
>   We are exploring options for server-side functions to retrieve these values as we move forward in stability for Server Actions.

### Error Handling

Server Actions can also return [serializable objects](https://developer.mozilla.org/docs/Glossary/Serialization).
For example, your Server Action might handle errors from creating a new item, returning either a success or error message:

```ts
// filename="app/actions.ts"
'use server';

export async function create(formData: FormData) {
  try {
    await createItem(formData.get('item'));
    revalidatePath('/');
    return { message: 'Success!' };
  } catch (e) {
    return { message: 'There was an error.' };
  }
}
```

Then, from a Client Component, you can read this value and save it to state, allowing the component to display the result of the Server Action to the viewer.

```tsx
// filename="app/page.tsx"
'use client';

import { create } from './actions';
import { useState } from 'react';

export default function Page() {
  const [message, setMessage] = useState<string>('');

  async function onCreate(formData: FormData) {
    const res = await create(formData);
    setMessage(res.message);
  }

  return (
    <form action={onCreate}>
      <input type="text" name="item" />
      <button type="submit">Add</button>
      <p>{message}</p>
    </form>
  );
}
```

> **Good to know:**
>
> - Displaying loading or error states currently requires using Client Components.
>   We are exploring options for server-side functions to retrieve these values as we move forward in stability for Server Actions.

### Optimistic Updates

Use `useOptimistic` to optimistically update the UI before the Server Action finishes, rather than waiting for the response:

```tsx
// filename="app/page.tsx"
'use client';

import { experimental_useOptimistic as useOptimistic } from 'react';
import { send } from './actions';

type Message = {
  message: string;
};

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[]>(
    messages,
    (state: Message[], newMessage: string) => [
      ...state,
      { message: newMessage },
    ],
  );

  return (
    <div>
      {optimisticMessages.map((m, k) => (
        <div key={k}>{m.message}</div>
      ))}
      <form
        action={async (formData: FormData) => {
          const message = formData.get('message');
          addOptimisticMessage(message);
          await send(message);
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Setting Cookies

You can set cookies inside a Server Action using the [`cookies`](/docs/app/api-reference/functions/cookies) function:

```ts
// filename="app/actions.ts"
'use server';

import { cookies } from 'next/headers';

export async function create() {
  const cart = await createCart();
  cookies().set('cartId', cart.id);
}
```

### Reading Cookies

You can read cookies inside a Server Action using the [`cookies`](/docs/app/api-reference/functions/cookies) function:

```ts
// filename="app/actions.ts"
'use server';

import { cookies } from 'next/headers';

export async function read() {
  const auth = cookies().get('authorization')?.value;
  // ...
}
```

### Deleting Cookies

You can delete cookies inside a Server Action using the [`cookies`](/docs/app/api-reference/functions/cookies) function:

```ts
// filename="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function delete() {
  cookies().delete('name')
  // ...
}
```

See [additional examples](/docs/app/api-reference/functions/cookies#deleting-cookies) for deleting cookies from Server Actions.
