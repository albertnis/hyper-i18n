// type StringToNumbers0To9 = {
//   "0": 0;
//   "1": 1;
//   "2": 2;
//   "3": 3;
//   "4": 4;
//   "5": 5;
//   "6": 6;
//   "7": 7;
//   "8": 8;
//   "9": 9;
// };

import {
  ArgType,
  NoneArgNode,
  AstNode,
  NodeType,
  ParseAsText,
  SimpleArgNode,
  SimpleStyledArgNode,
  ComplexArgNode,
} from "./ast";

type TypeFromArgtype<T extends ArgType> = T extends
  | "number"
  | "ordinal"
  | "duration"
  ? number
  : T extends "date" | "time"
  ? Date
  : string;

export type ArgsFromAst<Ast extends readonly any[]> = Ast extends []
  ? {}
  : Ast extends [infer Head extends AstNode<infer T>, ...infer Rest]
  ? ArgFromAstNode<T, Head> & ArgsFromAst<Rest>
  : never;

type ArgFromAstNode<
  T extends NodeType,
  A extends AstNode<T>
> = A extends NoneArgNode<infer N>
  ? { [k in N]: string }
  : A extends SimpleArgNode<infer N, infer AT>
  ? { [k in N]: TypeFromArgtype<AT> }
  : A extends SimpleStyledArgNode<infer N, infer AT, infer _>
  ? { [k in N]: TypeFromArgtype<AT> }
  : A extends ComplexArgNode<infer N, "plural">
  ? { [k in N]: number }
  : A extends ComplexArgNode<infer N, "select">
  ? { [k in N]: number | boolean | string }
  : {};
