type ValidTagName<T extends string> = T extends `/${string}` ? never : T;

type I18nTags<
  Template extends string,
  Output extends string = string
> = string extends Template
  ? // Disregard non-literal string
    never
  : // Look at the next <tag> in arrow brackets
  Template extends `${string}<${ValidTagName<infer TagName>}>${infer Rest1}`
  ? Rest1 extends `${infer Before}</${TagName}>${infer After}`
    ? { [k in TagName]: (child: string) => Output } & I18nTags<After> &
        I18nTags<Before>
    : never
  : {};
