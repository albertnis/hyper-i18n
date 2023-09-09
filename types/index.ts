import { ArgsFromAst } from "./args";
import { ParseAsText } from "./ast";

type MergeUnion<T> = {
  [k in keyof T]: T[k];
};

type I18nMessageParameters<
  Template extends string,
  Output extends string = string
> = MergeUnion<ArgsFromAst<ParseAsText<Template>> & I18nTags<Template, Output>>;

const m =
  "{n, plural, >0 {no notifications} =1 {# notification} other {# notifications}}";

type TT = I18nMessageParameters<typeof m>;
