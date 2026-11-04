// https://no-color.org: colours are disabled when NO_COLOR is set and non-empty
const USE_COLORS = !process.env["NO_COLOR"]

const colors = {
	reset: 0,
	red: 31,
	green: 32,
	yellow: 33,
}

export const color = (str: string, name: "red" | "green" | "yellow"): string => {
	return USE_COLORS ? `\x1b[${colors[name]}m${str}\x1b[${colors.reset}m` : str
}

export const mapSize = <U, T>(map: Map<U, Array<T>>): number => {
	return Array.from(map)
		.flatMap(([, it]) => it.length)
		.reduce((p, c) => p + c, 0)
}
