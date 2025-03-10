export function* range(a: number, b: number, step = 1) {
    for(let i = a; i < b; i += step) yield i;
}

export function leftPad(a: string, l: number, padding = ' '): string {
    while(a.length < l) a = padding + a;
    return a;
}
