declare function forceNumber(input: any): number;
declare namespace forceNumber {
  export function orNull(input: any): number | null;
}

export default forceNumber;
