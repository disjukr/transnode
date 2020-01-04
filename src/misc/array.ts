/**
 * `a`가 `b`의 부분집합인지 여부를 반환합니다.
*/
export function isSubsetOf<T>(a: T[], b: T[]): boolean {
  return a.every(type => b.includes(type));
}
