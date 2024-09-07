export function gcd(...nums: number[]): number {
  return nums.reduce((a, b) => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  });
}

export function lcm(...nums: number[]): number {
  return nums.reduce((a, b) => (a * b) / gcd(a, b));
}

export function range(len: number) {
  return [...Array(len).keys()];
}
