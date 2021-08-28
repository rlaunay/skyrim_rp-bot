

export default function memoized<A>(fn: (...args: number[]) => A): (args: number[]) => A {

  let lastResult: A | null = null;
  let lastArgs: number[] | null = null;

  return function memoizedFn(args: number[]) {
    if (lastArgs && args.join(',') !== lastArgs.join(',')) {
      lastResult = null;
    }

    if (lastResult && lastArgs) return lastResult;
    lastArgs = args;
    lastResult = fn(...args);
    return lastResult;
  };
}