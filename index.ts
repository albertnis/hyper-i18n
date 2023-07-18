type I18nArgName<Arg extends string> = Arg extends `${infer ArgName},${infer _}`
  ? ArgName
  : Arg;

type I18nArgNameExample = I18nArgName<"name, string">;

type I18nArgTypeof<Arg extends string> =
  Arg extends `${infer _}, number${infer __}`
    ? number
    : Arg extends `${infer _}, date${infer __}`
    ? Date
    : string;

type I18nArgNameTypeofExample = I18nArgName<"name, string">;

type I18nArgs<Template extends string> = string extends Template
  ? // Disregard non-literal string
    never
  : // Look at the next {arg} in curly braces
  Template extends `${infer _}{${infer Arg}}${infer Rest}`
  ? // Add the arg by its name to an object
    { [k in I18nArgName<Arg>]: I18nArgTypeof<Arg> } & I18nArgs<Rest>
  : {};

const strings = {
  title: "Hyper I18n",
  donation: "Donate ${amount, number, currency} to our project",
  greeting:
    "Hello {otherName}! My name is {myName} and it's nice to meet you. We first met on {meetingDate, date}",
} as const;

type Strings = typeof strings;
type I18nMessageKey = keyof Strings;

const f = <T extends I18nMessageKey>(
  messageKey: T,
  args: I18nArgs<Strings[T]>
) => {};

f("donation", { amount: 30 });

type I18nArgsExample = I18nArgs<(typeof strings)["greeting"]>;

const vars: I18nArgsExample = {
  myName: "",
  otherName: "",
  meetingDate: new Date(),
};
