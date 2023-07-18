type I18nArgs<Template extends string> = string extends Template
  ? string[]
  : Template extends ""
  ? {}
  : Template extends `${infer _}{${infer Arg}}${infer Rest}`
  ? { [k in Arg]: string } & I18nArgs<Rest>
  : {};

type I18nArgsExample =
  I18nArgs<"Hello {otherName}! My name is {myName} and it's nice to meet you.">;

const vars: I18nArgsExample = {
  myName: "",
  otherName: "",
};
