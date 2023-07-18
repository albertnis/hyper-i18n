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

type I18nTags<
  Template extends string,
  Output = string
> = string extends Template
  ? // Disregard non-literal string
    never
  : // Look at the next {arg} in curly braces
  Template extends `${infer _}<${infer Tag}>${infer Child}</${infer Tag}>${infer Rest}`
  ? // Add the arg by its name to an object
    { [k in Tag]: (child: string) => Output } & I18nArgs<Rest>
  : {};

type I18nMessageParameters<
  Template extends string,
  Output = string
> = I18nArgs<Template> & I18nTags<Template, Output>;

const strings = {
  title: "Hyper I18n",
  donation: "Donate ${amount, number, currency} to our project",
  greeting:
    "Hello {otherName}! My name is {myName} and it's nice to meet you. We first met on {meetingDate, date}",
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

f("tagged", {
  b: (child) => `**${child}**`,
  a: (child) => `[](${child})`,
  siteUrl: "https://example.com",
});

type I18nMessageParametersExample = I18nMessageParameters<
  (typeof strings)["tagged"]
>;

type NotArray = { 0: any; 1: any };

const me: NotArray = [1, 2];
