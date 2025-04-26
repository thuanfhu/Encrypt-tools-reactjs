export function extendedEuclid(a: bigint, b: bigint): [bigint, bigint, bigint] {
    if (b === 0n) {
        return [a, 1n, 0n];
    }

    const [gcd, x1, y1] = extendedEuclid(b, a % b);
    const x = y1;
    const y = x1 - (a / b) * y1;

    return [gcd, x, y];
}

export function modInverse(a: bigint, m: bigint): bigint {
    const [gcd, x, _] = extendedEuclid(a, m);

    if (gcd !== 1n) {
        throw new Error(`Nghịch đảo modulo không tồn tại: GCD(${a}, ${m}) ≠ 1`);
    }

    return (x % m + m) % m;
}

export function mod(a: bigint, m: bigint): bigint {
    return ((a % m) + m) % m;
}

export function isPrime(n: bigint): boolean {
    if (n <= 1n) return false;
    if (n <= 3n) return true;
    if (n % 2n === 0n || n % 3n === 0n) return false;

    for (let i = 5n; i * i <= n; i += 6n) {
        if (n % i === 0n || n % (i + 2n) === 0n) return false;
    }
    return true;
}