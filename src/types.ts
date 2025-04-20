/**
 * @author kazuya kawaguchi (a.k.a. @kazupon)
 * @license MIT
 */

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never

type LastOf<U> =
  UnionToIntersection<U extends unknown ? () => U : never> extends () => infer R ? R : never

export type UnionToTuple<T, L = LastOf<T>> = [T] extends [never]
  ? []
  : [...UnionToTuple<Exclude<T, L>>, L]
