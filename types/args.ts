type I18nArgTypeof<ArgType extends IcuArgType> = ArgType extends
  | "number"
  | "ordinal"
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

type SimpleArgWithStyle<
  ArgNameOrNumber extends string,
  ArgType extends IcuArgType,
  ArgStyle extends string
> = `{${ValidArgNameOrNumber<ArgNameOrNumber>}${Comma}${ArgType}${Comma}${ArgStyle}}`;

type ComplexArg2<
  ArgNameOrNumber extends string,
  D extends string,
  S1 extends string,
  S2 extends string
> = `{${ValidArgNameOrNumber<ArgNameOrNumber>}${Comma}${D}${Comma}${string}{${S1}}${string}{${S2}}}`;

type ComplexArg3<
  ArgNameOrNumber extends string,
  D extends string,
  S1 extends string,
  S2 extends string,
  S3 extends string
> = `{${ValidArgNameOrNumber<ArgNameOrNumber>}${Comma}${D}${Comma}${string}{${S1}}${string}{${S2}}${string}{${S3}}}`;

type PluralArg2<
  ArgNameOrNumber extends string,
  S1 extends string,
  S2 extends string
> = ComplexArg2<ArgNameOrNumber, "plural", S1, S2>;

type PluralArg3<
  ArgNameOrNumber extends string,
  S1 extends string,
  S2 extends string,
  S3 extends string
> = ComplexArg3<ArgNameOrNumber, "plural", S1, S2, S3>;

type SelectArg2<
  ArgNameOrNumber extends string,
  S1 extends string,
  S2 extends string
> = ComplexArg2<ArgNameOrNumber, "select", S1, S2>;

type SelectArg3<
  ArgNameOrNumber extends string,
  S1 extends string,
  S2 extends string,
  S3 extends string
> = ComplexArg3<ArgNameOrNumber, "select", S1, S2, S3>;

type I18nArgs<Template extends string> = string extends Template
  ? // Disregard non-literal string
    never
  : // --- Look for the next select3 arg
  Template extends `${infer Before}${SelectArg3<
      infer ArgNameOrNumber,
      infer S1,
      infer S2,
      infer S3
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: number | string | boolean } & I18nArgs<Before> &
      I18nArgs<S1> &
      I18nArgs<S2> &
      I18nArgs<S3> &
      I18nArgs<After>
  : // --- Look for the next select2 arg
  Template extends `${infer Before}${SelectArg2<
      infer ArgNameOrNumber,
      infer S1,
      infer S2
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: number | string | boolean } & I18nArgs<Before> &
      I18nArgs<S1> &
      I18nArgs<S2> &
      I18nArgs<After>
  : // --- Look for the next plural3 arg
  Template extends `${infer Before}${PluralArg3<
      infer ArgNameOrNumber,
      infer S1,
      infer S2,
      infer S3
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: number } & I18nArgs<Before> &
      I18nArgs<S1> &
      I18nArgs<S2> &
      I18nArgs<S3> &
      I18nArgs<After>
  : // --- Look for the next plural2 arg
  Template extends `${infer Before}${PluralArg2<
      infer ArgNameOrNumber,
      infer S1,
      infer S2
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: number } & I18nArgs<Before> &
      I18nArgs<S1> &
      I18nArgs<S2> &
      I18nArgs<After>
  : // --- Look for the next simple arg with style
  Template extends `${infer Before}${SimpleArgWithStyle<
      infer ArgNameOrNumber,
      infer ArgType,
      infer _
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: I18nArgTypeof<ArgType> } & I18nArgs<Before> &
      I18nArgs<After>
  : // --- Look for the next simple arg
  Template extends `${infer Before}${SimpleArg<
      infer ArgNameOrNumber,
      infer ArgType
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: I18nArgTypeof<ArgType> } & I18nArgs<Before> &
      I18nArgs<After>
  : // --- Look for next none tag
  Template extends `${infer Before}${NoneArg<
      infer ArgNameOrNumber
    >}${infer After}`
  ? { [k in ArgNameOrNumber]: string } & I18nArgs<Before> & I18nArgs<After>
  : {};
