export function createAutoIncrement(start: number = 1) {
  let current = start;
  return () => current++;
}
