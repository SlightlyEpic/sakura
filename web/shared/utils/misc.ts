export function* range(a: number, b: number, step = 1) {
    for(let i = a; i < b; i += step) yield i;
}
