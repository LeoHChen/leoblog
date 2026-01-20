---
title: 'TypeScript Tips for Better Code'
description: 'Practical TypeScript tips that will improve your code quality and developer experience.'
pubDate: 2025-12-20
tags: ['typescript', 'javascript', 'programming']
---

TypeScript has become an essential tool in modern web development. Here are some tips I've learned that have made my TypeScript code better.

## Use Strict Mode

Always enable strict mode in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

This catches many potential bugs at compile time rather than runtime.

## Prefer Type Inference

Let TypeScript infer types when possible:

```typescript
// Good - type is inferred
const numbers = [1, 2, 3, 4, 5];

// Unnecessary - type annotation not needed
const numbers: number[] = [1, 2, 3, 4, 5];
```

## Use Unknown Instead of Any

When you don't know the type, use `unknown` instead of `any`:

```typescript
function processValue(value: unknown) {
  // Must narrow the type before using
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}
```

This forces you to validate types before using them.

## Leverage Utility Types

TypeScript's built-in utility types are powerful:

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

// Pick only what you need
type PublicUser = Omit<User, 'password'>;

// Make properties optional
type UserUpdate = Partial<User>;

// Make properties readonly
type ImmutableUser = Readonly<User>;
```

## Discriminated Unions

Use discriminated unions for type-safe state management:

```typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: Error };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'success':
      return state.data; // TypeScript knows data exists
    case 'error':
      return state.error; // TypeScript knows error exists
  }
}
```

## Const Assertions

Use `as const` for literal types:

```typescript
const config = {
  api: 'https://api.example.com',
  timeout: 5000,
} as const;

// config.api has type 'https://api.example.com', not string
```

## Conclusion

TypeScript is a powerful tool, but it's most effective when you use its features thoughtfully. These tips should help you write more type-safe and maintainable code.

Happy typing!
