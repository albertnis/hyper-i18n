# hyper-i18n

Experimental typesafe internationalisation library inspired by [typesafe-i18n](https://github.com/ivanhofer/typesafe-i18n) and [intl-messageformat](https://github.com/formatjs/formatjs/tree/main/packages/intl-messageformat).

A shortcoming of `typesafe-i18n` is that it requires type generation to run in the backround. hyper-i18n aims to answer the question: **What if an ICU message parser could be written directly in the TypeScript type language, with no type generation required?**

## Features

- Provides type definitions for message argument objects based on ICU message string literals
- Input arguments if they are all tagged as numbers rather than names in the message
- Argument types are mapped from ICU types
- No background type generation
- Supports complex arguments up to three cases
- Supports tags message tags in a framework-agnostic manner

## Limitations

The current limitations of hyper-i18n are numerous. It's an experiment, after all!

- Nested complex arguments are not supported
- Complex arguments are only supported with up to three cases
- Commas used as part of the ICU syntax must be followed with a space
- Messages must be `const` string types
- The library contains types only; no runtime message parser is implemented
- Arg numbers must start at 0
- Arg numbers above 9 are not supported
- No duration support yet (but this would be easy to add)

## How it works

hyper-i18n relies heavily on TypeScript's [template literal types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) to split messages into their consituent arguments and tags, using inference to compute the nature of each tag.

## Examples

Here are some examples of usage with computed TypeScript output below each.

### "None" arg

```ts
type Args = I18nMessageParameters<"Hello, {name}!">;

// type Args = {
//     name: string;
// }
```

### List of args

```ts
type Args = I18nMessageParameters<"Your top vehicles: {0}, {1} and {2}">;
// type Args = {
//     0: string;
//     1: string;
//     2: string;
// }

const argsBad: Args = ["Planes", "Trains"];
// Property '2' is missing in type '[string, string]'

const args: Args = ["Planes", "Trains", "Automobiles"];
```

### Tags

A tag causes the Args to contain a corresponding function which takes the contents of the tag and returns something else. By default, this output is a string:

```tsx
type Args =
  I18nMessageParameters<"Your high score of {highScore, number} is <i>incredible</i>">;

// type Args = {
//     highScore: number;
//     i: (child: string) => string;
// }
```

By passing a second type parameter, a framework-specific output can be used. For example, a React component:

```tsx
type Args = I18nMessageParameters<
  "Your high score of {highScore, number} is <i>incredible</i>",
  JSX.Element
>;

// type Args = {
//     highScore: number;
//     i: (child: string) => JSX.Element;
// }
```

### Select

```ts
type Args =
  I18nMessageParameters<"You liked {gender, select, female {her} male {his} other {their}} photo">;

// type Args = {
//     gender: string | number | boolean;
// }
```

### Plural

```ts
type Args =
  I18nMessageParameters<"You liked {n, plural, 0 {no notifications} =1 {# notification} other {# notifications}}">;

// type Args = {
//     n: number;
// }
```

### Format function

Real-world usage of i18n libraries generally involves a big object of strings and a function for formatting them with arguments.

```ts
const strings = {
  title: "Global Frog Rescue",
  donation:
    "This month, we have received ${amount, number, currency} in donations. <i>Thank you</i>.",
  dates:
    "Our next volunteering sessions are {0, date}, {1, date} and {2, date}",
} as const;

const f = <T extends keyof typeof strings>(
  ...args: {} extends I18nMessageParameters<(typeof strings)[T]>
    ? [T] // Message has no args -> just take the string name
    : [T, I18nMessageParameters<(typeof strings)[T]>] // Take args too
) => {
  // Actual message parser implementation goes here
};
```

This allows usage as follows:

```ts
const titleMessage = f("title");

const donationMessage = f("donation", {
  amount: 3200.45,
  i: (x) => `*${x}*`,
});

const datesMessage = f("dates", [new Date(), new Date(), new Date()]);
```

TypeScript will complain if arguments are bad or missing:

```ts
const badMessage = f("bad");
// Argument of type '"bad"' is not assignable to parameter of type '"title" | "donation" | "dates"'

const titleMessage = f("title", {});
// Expected 1 arguments, but got 2

const donationMessage = f("donation", {
  amount: "3,200.45", // Type 'string' is not assignable to type 'number'
  i: (x) => `*${x}*`,
});
```
