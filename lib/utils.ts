const USE_COLORS = process.env["NO_COLOR"] !== undefined;

const colors = {
  reset: 0,
  red: 31,
  green: 32,
  yellow: 33,
};

export const color = (str: string, color: "red" | "green" | "yellow") => {
  return USE_COLORS ? str : `\x1b[${colors[color]}m${str}\x1b[${colors.reset}m`;
};

export const mapSize = <U, T>(map: Map<U, Array<T>>): number => {
  return Array.from(map)
    .flatMap(([, it]) => it.length)
    .reduce((p, c) => p + c);
};
