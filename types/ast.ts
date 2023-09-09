export type ArgType =
  | "number"
  | "date"
  | "time"
  | "spellout"
  | "ordinal"
  | "duration";
type ComplexType = "select" | "plural";

type ArgName = string;

export type NodeType =
  | "character"
  | "none"
  | "simple"
  | "simple_styled"
  | "complex"
  | "complex_case"
  | "complex_end";

export type AstNode<T extends NodeType> = {
  type: T;
};

export interface CharacterNode<T extends string> extends AstNode<"character"> {
  content: T;
}

export interface NoneArgNode<N extends ArgName> extends AstNode<"none"> {
  name: N;
}

export interface SimpleArgNode<N extends ArgName, T extends ArgType>
  extends AstNode<"simple"> {
  name: N;
  argType: T;
}

export interface SimpleStyledArgNode<
  N extends ArgName,
  T extends ArgType,
  S extends string
> extends AstNode<"simple_styled"> {
  name: N;
  argType: T;
  style: S;
}

export interface ComplexArgNode<N extends ArgName, T extends ComplexType>
  extends AstNode<"complex"> {
  name: N;
  complexType: T;
}

export interface ComplexArgCase<C extends string>
  extends AstNode<"complex_case"> {
  condition: C;
}

export interface ComplexArgEnd extends AstNode<"complex_end"> {
  type: "complex_end";
}

type ParseTextNode<T> = T extends `${infer Text}{` ? Text : T;

type ParseMode = "text" | "arg";

type State = readonly ParseMode[];

type LastItem<T extends readonly unknown[]> = T extends [...infer _, infer Tail]
  ? Tail
  : never;

type ParseComplexArgCases<T extends string> = T extends `}${infer Rest}`
  ? // Complex Arg is being exited
    [ComplexArgEnd, ...ParseAsText<Rest>]
  : T extends ` ${infer Case} {${infer Rest}`
  ? [ComplexArgCase<Case>, ...ParseAsText<Rest>]
  : [];

type pcac = ParseComplexArgCases<" =0 {hello} >1 {more}} hi">;

type ParseAsArg<T extends string> =
  T extends `${infer Name extends ArgName}, ${infer Type extends ComplexType},${infer Rest}`
    ? [ComplexArgNode<Name, Type>, ...ParseComplexArgCases<Rest>]
    : T extends `${infer Name extends ArgName}, ${infer Type extends ArgType}, ${infer S}}${infer Rest}`
    ? [SimpleStyledArgNode<Name, Type, S>, ...ParseAsText<Rest>]
    : T extends `${infer Name extends ArgName}, ${infer Type extends ArgType}}${infer Rest}`
    ? [SimpleArgNode<Name, Type>, ...ParseAsText<Rest>]
    : T extends `${infer Name extends ArgName}}${infer Rest}`
    ? [NoneArgNode<Name>, ...ParseAsText<Rest>]
    : never;

export type ParseAsText<T extends string> =
  T extends `${infer Head}${infer Rest}`
    ? // We are entering an arg from text
      Head extends "{"
      ? ParseAsArg<Rest>
      : // We are exiting a complex arg case
      Head extends "}"
      ? ParseComplexArgCases<Rest>
      : // Reached end of string
      Head extends ""
      ? []
      : // Add the character and keep parsing text
        [CharacterNode<Head>, ...ParseAsText<Rest>]
    : [];

const m = "{n, plural, >0 {no notifications} =1 {# notification}}";

type ttt = ParseAsText<typeof m>;
