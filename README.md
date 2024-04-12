# react-swift-form

<p align="center">
  <img alt="react-swift-form Logo" src="/doc/static/img/logo.svg#gh-light-mode-only" width="200" />
  <img alt="react-swift-form Logo" src="/doc/static/img/logo-dark.svg#gh-dark-mode-only" width="200" />
</p>
<p align="center">
  Fast and easy form validation for React based on native HTML capabilities
</p>
<p align="center">
  <a href="https://tonai.github.io/react-swift-form/" target="_blank">Documentation</a>
</p>

## Features

- ☯ Very easy to use
- 🚀 Really fast
- 🏋 Extra small bundle size
- 🤯 Can works without any state
- 💅 Native and customizable errors
- 👯 Multiple validation modes
- 📑 Custom validation with
  - 🎉 Cross inputs validation
  - 😎 Global form validation
  - 🔥 Support dynamic form
- 💬 Custom messages / translations
- 💯 Fully tested
- 📚 Support controlled components and UI libraries
- ⚡️ Compatible with Next.js server actions
- 👀 Watch values
- 💪 And much more...

## Install

```bash
# npm
npm install react-hook-form
# yarn
yarn add react-hook-form
# pnpm
pnpm install react-hook-form
```

## Usage

### With hook

```tsx
import type { FormEvent } from 'react';
import { type IFormValues, useForm } from 'react-swift-form';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  const { formProps } = useForm({
    onSubmit: handleSubmit,
  });

  return (
    <form {...formProps}>
      <input name="text" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Or with component

```tsx
import type { FormEvent } from 'react';
import { Form, type IFormValues } from 'react-swift-form';

export default function Demo() {
  function handleSubmit(e: FormEvent<HTMLFormElement>, values: IFormValues) {
    e.preventDefault();
    console.log(values);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <input name="text" required />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

Check the [documentation](https://tonai.github.io/react-swift-form/) for more.

## Examples

Check the [example App](https://github.com/tonai/react-swift-form/tree/main/example-app).

Clone this repo and then run:

```bash
npm i
npm run dev
```
