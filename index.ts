type I18nArgTypeof<ArgType extends string> = ArgType extends `number`
  ? number
  : ArgType extends `date`
  ? Date
  : string;

type IcuArgType =
  | "number"
  | "date"
  | "time"
  | "spellout"
  | "ordinal"
  | "duration";

type StringToNumbers0To9 = {
  "0": 0;
  "1": 1;
  "2": 2;
  "3": 3;
  "4": 4;
  "5": 5;
  "6": 6;
  "7": 7;
  "8": 8;
  "9": 9;
};

type Comma = ", ";

type ValidArgNameOrNumber<T extends string> = T extends `${string}${
  | "}"
  | ","}${string}`
  ? never
  : T extends keyof StringToNumbers0To9
  ? // If the name is a number 0..9 (as defined by spec) use the corresponding number literal
    StringToNumbers0To9[T]
  : T;

type NoneArg<ArgNameOrNumber extends string> =
  `{${ValidArgNameOrNumber<ArgNameOrNumber>}}`;

type SimpleArg<
  ArgNameOrNumber extends string,
  ArgType extends IcuArgType
> = `{${ValidArgNameOrNumber<ArgNameOrNumber>}${Comma}${ArgType}}`;

type jisdo = SimpleArg<"9", "number">;

type SimpleArgWithStyle<
  ArgNameOrNumber extends string,
  ArgType extends IcuArgType,
  ArgStyle extends string
> = `{${ValidArgNameOrNumber<ArgNameOrNumber>}${Comma}${ArgType}${Comma}${ArgStyle}}`;

type I18nArgs<Template extends string> = string extends Template
  ? // Disregard non-literal string
    never
  : // --- Look for the next simple arg with style
  Template extends `${infer Before}${SimpleArgWithStyle<
      infer ArgNameOrNumber,
      infer ArgType,
      infer _
    >}${infer After}`
  ? // Add the arg by its name to an object
    { [k in ArgNameOrNumber]: I18nArgTypeof<ArgType> } & I18nArgs<Before> &
      I18nArgs<After>
  : // --- Look for the next simple arg
  Template extends `${infer Before}${SimpleArg<
      infer ArgNameOrNumber,
      infer ArgType
    >}${infer After}`
  ? // Add the arg by its name to an object
    { [k in ArgNameOrNumber]: I18nArgTypeof<ArgType> } & I18nArgs<Before> &
      I18nArgs<After>
  : // --- Look for next none tag
  Template extends `${infer Before}${NoneArg<
      infer ArgNameOrNumber
    >}${infer After}`
  ? // Add the arg by its name to an object
    { [k in ArgNameOrNumber]: string } & I18nArgs<Before> & I18nArgs<After>
  : {};

type ii =
  I18nArgs<"You are {name, date} {today, date} and today is {today, date}">;

type ValidTagName<T extends string> = T extends `/${string}` ? never : T;

type I18nTags<
  Template extends string,
  Output = string
> = string extends Template
  ? // Disregard non-literal string
    never
  : // Look at the next <tag> in arrow brackets
  Template extends `${string}<${ValidTagName<infer TagName>}>${infer Rest1}`
  ? Rest1 extends `${infer Child}</${TagName}>${infer Rest2}`
    ? // Add the arg by its name to an object
      { [k in TagName]: (child: string) => Output } & I18nTags<Rest2> &
        I18nTags<Child>
    : never
  : {};

type iii = I18nTags<"<a><b></b><c></c><d>wow</d> out</a>">;
type iai = I18nTags<"<a></a><b></b><c></c>">;

type I18nMessageParameters<
  Template extends string,
  Output = string
> = I18nArgs<Template> & I18nTags<Template, Output>;

const strings = {
  title: "Hyper I18n",
  donation: "Donate ${amount, number, currency} to our project",
  nums: "Your top three items are {0, number}, {1, number}, {1, number} and {2, number}.",
  spacesInArg:
    "This {arg name, number} has a space in it which I think is valid {maybe, date}",
  noSpaceAfterComma:
    "What about simple args like: {simple,date} which have no space after the comma {withSpace, number} {withoutSpace, duration}",
  greeting:
    "Hello {otherName}, My name is {myName} and it's nice to meet you. We first met on {meetingDate, date, short}",
  tagged:
    "<b>This entire sentence is bold and has a link to my site: <a>{siteUrl}</a></b>",
  complex:
    "You have {notificationCount, plural, =0 {no notifications} one {# notification} other {# notifications}}",
} as const;

type Strings = typeof strings;
type I18nMessageKey = keyof Strings;

const f = <T extends I18nMessageKey>(
  messageKey: T,
  args: I18nMessageParameters<Strings[T]>
) => {};

type I18nMessageParametersExample = I18nMessageParameters<
  (typeof strings)["noSpaceAfterComma"]
>;

f("nums", [0, 2, 3]);
