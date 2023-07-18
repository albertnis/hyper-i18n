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
    string[]
  : // Is there nothing left to process?
  Template extends ""
  ? {}
  : // Look at the next {arg} in curly braces
  Template extends `${infer _}{${infer Arg}}${infer Rest}`
  ? // Add the arg by its name to an object
    { [k in I18nArgName<Arg>]: I18nArgTypeof<Arg> } & I18nArgs<Rest>
  : {};

type I18nArgsExample =
  I18nArgs<"Hello {otherName}! My name is {myName} and it's nice to meet you. We first met on {meetingDate, date}">;

const vars: I18nArgsExample = {
  myName: "",
  otherName: "",
  meetingDate: new Date(),
};
