const { random, floor } = Math;

export function getRandomInt(
    opts: Partial<{
        from: number;
        to: number;
    }> = {}
) {
    const { from = 0, to = 100 } = opts;

    if (to < from) {
        throw new Error('The "to" should not be less than the "from".');
    }

    if (from === to && !from) {
        return 0;
    }

    const maxRandom = random() * to;

    if (maxRandom < from) {
        return floor(from);
    }

    return floor(maxRandom);
}
