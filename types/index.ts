type MergeUnion<T> = {
  [k in keyof T]: T[k];
};

type I18nMessageParameters<
  Template extends string,
  Output extends string = string
> = MergeUnion<I18nArgs<Template> & I18nTags<Template, Output>>;
